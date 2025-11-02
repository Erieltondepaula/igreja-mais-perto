import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertCircle,
  CheckCircle,
  Upload,
  FileText,
  Users,
  RefreshCw,
  X,
  Eye
} from 'lucide-react';

const ImportacaoInterativa = () => {
  const [etapa, setEtapa] = useState('upload'); // upload, analise, processamento, concluido
  const [dadosAnalise, setDadosAnalise] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultados, setResultados] = useState([]);
  const [modalConfirmacao, setModalConfirmacao] = useState(null);
  const [estatisticasFinais, setEstatisticasFinais] = useState(null);

  // Configuração do dropzone
  const onDrop = useCallback(async (arquivos) => {
    const arquivo = arquivos[0];
    if (!arquivo) return;

    setProcessando(true);
    setEtapa('analise');

    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);

  const response = await fetch('/api/importar', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (resultado.sucesso) {
        setDadosAnalise(resultado);
        setEtapa('processamento');
      } else {
        alert('Erro ao processar arquivo: ' + resultado.erro);
        setEtapa('upload');
      }
    } catch (error) {
      alert('Erro ao enviar arquivo: ' + error.message);
      setEtapa('upload');
    } finally {
      setProcessando(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  // Confirmar ação para um item específico
  const confirmarAcao = async (item, acao) => {
    if (item.requerConfirmacao && acao === 'atualizar') {
      setModalConfirmacao({
        item,
        acao,
        onConfirm: () => executarAcao(item, acao),
        onCancel: () => setModalConfirmacao(null)
      });
    } else {
      await executarAcao(item, acao);
    }
  };

  // Executar ação individual
  const executarAcao = async (item, acao) => {
    try {
      const response = await fetch('/api/importacao/executar-acao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dadosLinha: item,
          acao: acao
        }),
      });

      const resultado = await response.json();

      // Atualizar resultado local
      setResultados(prev => [
        ...prev,
        {
          linha: item.linha,
          acao: acao,
          resultado: resultado,
          item: item
        }
      ]);

      // Fechar modal se estiver aberto
      setModalConfirmacao(null);

      // Atualizar progresso
      const novoProgresso = ((resultados.length + 1) / dadosAnalise.dados.length) * 100;
      setProgresso(novoProgresso);

      // Se terminou, mostrar estatísticas
      if (resultados.length + 1 === dadosAnalise.dados.length) {
        calcularEstatisticasFinais();
        setEtapa('concluido');
      }

    } catch (error) {
      alert('Erro ao executar ação: ' + error.message);
    }
  };

  // Processar todos automaticamente (apenas novos usuários)
  const processarTodosAutomaticos = async () => {
    const acoesPendentes = dadosAnalise.dados
      .filter(item => item.acao === 'criar_novo' || item.acao === 'sem_alteracao')
      .map(item => ({
        dadosLinha: item,
        acao: item.acao === 'criar_novo' ? 'criar_novo' : 'ignorar'
      }));

    if (acoesPendentes.length === 0) return;

    try {
      const response = await fetch('/api/importacao/executar-lote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acoes: acoesPendentes }),
      });

      const resultado = await response.json();

      // Adicionar resultados
      const novosResultados = resultado.resultados.map(r => ({
        linha: r.linha,
        acao: acoesPendentes.find(a => a.dadosLinha.linha === r.linha)?.acao,
        resultado: r.resultado,
        item: dadosAnalise.dados.find(d => d.linha === r.linha)
      }));

      setResultados(prev => [...prev, ...novosResultados]);
      setProgresso(((resultados.length + novosResultados.length) / dadosAnalise.dados.length) * 100);

    } catch (error) {
      alert('Erro no processamento automático: ' + error.message);
    }
  };

  // Calcular estatísticas finais
  const calcularEstatisticasFinais = () => {
    const stats = {
      total: resultados.length,
      criados: resultados.filter(r => r.resultado.acao === 'criado').length,
      atualizados: resultados.filter(r => r.resultado.acao === 'atualizado').length,
      ignorados: resultados.filter(r => r.resultado.acao === 'ignorado').length,
      erros: resultados.filter(r => !r.resultado.sucesso).length
    };
    setEstatisticasFinais(stats);
  };

  // Reset para novo processo
  const reiniciar = () => {
    setEtapa('upload');
    setDadosAnalise(null);
    setProcessando(false);
    setProgresso(0);
    setResultados([]);
    setModalConfirmacao(null);
    setEstatisticasFinais(null);
  };

  // Renderizar etapa de upload
  const renderUpload = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importação Interativa de Usuários
        </CardTitle>
        <CardDescription>
          Faça upload de uma planilha Excel para importar usuários com confirmação interativa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg">Solte o arquivo aqui...</p>
          ) : (
            <>
              <p className="text-lg mb-2">Arraste um arquivo Excel aqui</p>
              <p className="text-sm text-gray-600">ou clique para selecionar</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Renderizar etapa de análise
  const renderAnalise = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Analisando Arquivo...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin mr-4" />
          <span className="text-lg">Processando dados da planilha...</span>
        </div>
      </CardContent>
    </Card>
  );

  // Renderizar etapa de processamento
  const renderProcessamento = () => (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Análise da Importação</CardTitle>
          <CardDescription>
            Revise os dados antes de confirmar as operações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {dadosAnalise.estatisticas.novosUsuarios}
              </div>
              <div className="text-sm text-gray-600">Novos usuários</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {dadosAnalise.estatisticas.atualizacoes}
              </div>
              <div className="text-sm text-gray-600">Requer confirmação</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {dadosAnalise.estatisticas.semAlteracao}
              </div>
              <div className="text-sm text-gray-600">Sem alteração</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {dadosAnalise.estatisticas.totalLinhas}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button onClick={processarTodosAutomaticos}>
              Processar Automáticos
            </Button>
            <Button variant="outline" onClick={reiniciar}>
              Cancelar
            </Button>
          </div>

          {progresso > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>{Math.round(progresso)}%</span>
              </div>
              <Progress value={progresso} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de dados */}
      <Card>
        <CardHeader>
          <CardTitle>Dados para Processamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Linha</TableHead>
                <TableHead>ID Externo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosAnalise.dados.map((item) => {
                const resultado = resultados.find(r => r.linha === item.linha);
                
                return (
                  <TableRow key={item.linha}>
                    <TableCell>{item.linha}</TableCell>
                    <TableCell>{item.idExterno}</TableCell>
                    <TableCell>{item.nomeCompleto}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.acao === 'criar_novo' ? 'default' :
                        item.acao === 'confirmar_atualizacao' ? 'destructive' :
                        'secondary'
                      }>
                        {item.acao === 'criar_novo' ? 'Criar' :
                         item.acao === 'confirmar_atualizacao' ? 'Atualizar' :
                         'Sem alteração'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {resultado ? (
                        <Badge variant={resultado.resultado.sucesso ? 'default' : 'destructive'}>
                          {resultado.resultado.sucesso ? 
                            resultado.resultado.acao : 'Erro'}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pendente</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!resultado && (
                        <div className="flex gap-2">
                          {item.acao === 'criar_novo' && (
                            <Button 
                              size="sm" 
                              onClick={() => confirmarAcao(item, 'criar_novo')}
                            >
                              Criar
                            </Button>
                          )}
                          {item.acao === 'confirmar_atualizacao' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => confirmarAcao(item, 'atualizar')}
                              >
                                Atualizar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => confirmarAcao(item, 'ignorar')}
                              >
                                Ignorar
                              </Button>
                            </>
                          )}
                          {item.acao === 'sem_alteracao' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => confirmarAcao(item, 'ignorar')}
                            >
                              OK
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar etapa concluída
  const renderConcluido = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Importação Concluída
        </CardTitle>
      </CardHeader>
      <CardContent>
        {estatisticasFinais && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {estatisticasFinais.criados}
              </div>
              <div className="text-sm">Usuários criados</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {estatisticasFinais.atualizados}
              </div>
              <div className="text-sm">Usuários atualizados</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600">
                {estatisticasFinais.ignorados}
              </div>
              <div className="text-sm">Ignorados</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {estatisticasFinais.erros}
              </div>
              <div className="text-sm">Erros</div>
            </div>
          </div>
        )}
        
        <Button onClick={reiniciar} className="w-full">
          Nova Importação
        </Button>
      </CardContent>
    </Card>
  );

  // Modal de confirmação
  const renderModalConfirmacao = () => {
    if (!modalConfirmacao) return null;

    const { item } = modalConfirmacao;

    return (
      <Dialog open={!!modalConfirmacao} onOpenChange={() => setModalConfirmacao(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Atualização</DialogTitle>
            <DialogDescription>
              O usuário já existe no banco. Deseja aplicar as alterações?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <strong>Usuário:</strong> {item.nomeCompleto}
            </div>
            
            {item.diferencas && item.diferencas.length > 0 && (
              <div>
                <strong>Alterações:</strong>
                <div className="mt-2 space-y-2">
                  {item.diferencas.map((diff, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium">{diff.label}:</div>
                      <div className="text-sm">
                        <span className="text-red-600">Atual: {diff.valorAtual || '(vazio)'}</span>
                        <br />
                        <span className="text-green-600">Novo: {diff.valorNovo || '(vazio)'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={modalConfirmacao.onCancel}>
              Cancelar
            </Button>
            <Button onClick={modalConfirmacao.onConfirm}>
              Confirmar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto p-6">
      {etapa === 'upload' && renderUpload()}
      {etapa === 'analise' && renderAnalise()}
      {etapa === 'processamento' && renderProcessamento()}
      {etapa === 'concluido' && renderConcluido()}
      {renderModalConfirmacao()}
    </div>
  );
};

export default ImportacaoInterativa;