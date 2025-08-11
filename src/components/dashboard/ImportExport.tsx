import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/types/member';
import { exportToExcel, importFromExcel } from '@/utils/excelUtils';
import { exportToPDF } from '@/utils/pdfUtils';
import { Upload, Download, FileSpreadsheet, Database, AlertCircle, CheckCircle2, X, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { MemberFilters } from '@/types/member';

interface ImportExportProps {
  members: Member[];
  filteredMembers?: Member[];
  filters?: MemberFilters;
  onImport: (members: Partial<Member>[]) => void;
  onReplaceAll: (members: Partial<Member>[]) => void;
}

export const ImportExport = ({ members, filteredMembers, filters, onImport, onReplaceAll }: ImportExportProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<Partial<Member>[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleExportAll = () => {
    exportToExcel(members, 'todos-membros');
    toast({
      title: "Exportação concluída",
      description: "Arquivo Excel baixado com sucesso!"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setUploadProgress(0);
    
    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const importedMembers = await importFromExcel(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setPreviewData(importedMembers);
      setShowPreview(true);
      
      toast({
        title: "Arquivo carregado com sucesso!",
        description: `${importedMembers.length} registros encontrados. Revise os dados antes de importar.`
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar arquivo",
        description: "Não foi possível ler o arquivo. Verifique o formato.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const confirmImport = (replaceAll: boolean = false) => {
    if (replaceAll) {
      onReplaceAll(previewData);
      toast({
        title: "Base de dados substituída",
        description: `${previewData.length} membros carregados. Dados anteriores foram removidos.`
      });
    } else {
      onImport(previewData);
      toast({
        title: "Membros adicionados",
        description: `${previewData.length} novos membros adicionados à base existente.`
      });
    }
    setShowPreview(false);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelImport = () => {
    setShowPreview(false);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportPDF = () => {
    const membersToExport = filteredMembers || members;
    exportToPDF(membersToExport, filters, 'relatorio-membros');
    toast({
      title: "Exportação PDF concluída",
      description: "Relatório PDF baixado com sucesso!"
    });
  };

  const downloadTemplate = () => {
    const template = [{
      'Nome': 'Exemplo da Silva',
      'Data de Nascimento': '1990-01-01',
      'Sexo': 'Masculino',
      'Telefone': '(11) 99999-9999',
      'Email': 'exemplo@email.com',
      'Endereço': 'Rua Exemplo, 123',
      'Bairro': 'Centro',
      'Cidade': 'São Paulo',
      'CEP': '01234-567',
      'Status': 'ativo',
      'Data Batismo': '',
      'Data Membresia': '',
      'Data Desligamento': '',
      'Observações': ''
    }];

    const XLSX = require('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(data);
    link.download = 'template-membros.xlsx';
    link.click();

    toast({
      title: "Template baixado",
      description: "Use este arquivo como modelo para importação!"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Upload e Análise de Base de Dados XLS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Área de Upload */}
        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Carregar Base de Dados</h3>
              <p className="text-sm text-muted-foreground">
                Faça upload do seu arquivo XLS para análise completa
              </p>
            </div>
            
            <Input
              id="upload-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={importing}
              ref={fileInputRef}
              className="hidden"
            />
            
            <Button
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="w-full max-w-xs"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Carregando...' : 'Selecionar Arquivo XLS'}
            </Button>
            
            {uploadProgress > 0 && (
              <div className="w-full max-w-xs mx-auto">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadProgress}% carregado
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview dos Dados */}
        {showPreview && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-4">
                <div>
                  <strong>Arquivo carregado com sucesso!</strong>
                  <p className="text-sm mt-1">
                    Encontrados {previewData.length} registros. Primeiros registros:
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded p-3 text-xs space-y-1 max-h-32 overflow-y-auto">
                  {previewData.slice(0, 5).map((member, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="font-medium">{member.nome}</span>
                      <span>{member.sexo === 'M' ? 'Masc.' : 'Fem.'}</span>
                      <span>{member.bairro}</span>
                      <span>{member.status}</span>
                    </div>
                  ))}
                  {previewData.length > 5 && (
                    <div className="text-muted-foreground">
                      ... e mais {previewData.length - 5} registros
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => confirmImport(false)} size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    Adicionar aos Existentes
                  </Button>
                  <Button onClick={() => confirmImport(true)} variant="outline" size="sm">
                    <Database className="h-3 w-3 mr-1" />
                    Substituir Todos os Dados
                  </Button>
                  <Button onClick={cancelImport} variant="ghost" size="sm">
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={handleExportAll} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>

          <Button onClick={handleExportPDF} variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>

          <Button variant="outline" onClick={downloadTemplate} className="w-full">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Baixar Template
          </Button>
        </div>

        {/* Instruções */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Formato do Arquivo
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Colunas obrigatórias:</strong> Nome, Data de Nascimento, Sexo, Bairro</p>
            <p><strong>Data de nascimento:</strong> AAAA-MM-DD (ex: 1990-12-25)</p>
            <p><strong>Sexo:</strong> "Masculino" ou "Feminino" (ou "M"/"F")</p>
            <p><strong>Status:</strong> "ativo", "batizado", "membro" ou "desligado"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};