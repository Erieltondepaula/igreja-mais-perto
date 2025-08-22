import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Member, MemberFilters } from '@/types/member';
import { importFromExcel, exportToExcel } from '@/utils/excelUtils';
import { exportToPDF } from '@/utils/pdfUtils'; // Importação correta
import { Upload, Download, FileSpreadsheet, Database, AlertCircle, CheckCircle2, X, FileText, Link as LinkIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ImportExportProps {
  members: Member[];
  filteredMembers?: Member[];
  filters?: MemberFilters;
  onImport: (members: Partial<Member>[]) => void;
  onReplaceAll: (members: Partial<Member>[]) => void;
}

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdZMkpYxYB5uydpPPPhJWL0uPyBa44JOWzSyDQxcKof3mAbfvOCk2c9nZOiOFkRz7convCRILjtzuH/pub?output=csv';

export const ImportExport = ({ members, filteredMembers, filters, onImport, onReplaceAll }: ImportExportProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<Partial<Member>[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  const processAndPreview = async (data: Partial<Member>[]) => {
      setPreviewData(data);
      setShowPreview(true);
      toast({
        title: "Dados carregados com sucesso!",
        description: `${data.length} registros encontrados. Revise os dados antes de importar.`
      });
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadProgress(30);
    try {
      const importedMembers = await importFromExcel(file);
      setUploadProgress(100);
      await processAndPreview(importedMembers);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
        toast({
            title: "Erro ao carregar arquivo",
            description: errorMessage,
            variant: "destructive"
        });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGoogleSheetImport = async () => {
    setLoading(true);
    setUploadProgress(30);
    toast({ title: "Buscando dados da planilha online..." });
    try {
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(GOOGLE_SHEET_CSV_URL)}`);
        
        if (!response.ok) {
            throw new Error('Não foi possível acessar a planilha. Verifique se ela está publicada para a web.');
        }
        const csvText = await response.text();
        if(csvText.trim().startsWith('<!DOCTYPE html>')) {
            throw new Error('O link retornou uma página HTML em vez de dados. Verifique a URL da planilha.');
        }
        const blob = new Blob([csvText], { type: 'text/csv' });
        const file = new File([blob], "google_sheet.csv", { type: "text/csv" });
        const importedMembers = await importFromExcel(file);
        setUploadProgress(100);
        await processAndPreview(importedMembers);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
        toast({ title: "Erro ao importar do Google Sheets", description: errorMessage, variant: "destructive" });
    } finally {
        setLoading(false);
        setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const confirmImport = (replaceAll: boolean = false) => {
    if (replaceAll) {
      onReplaceAll(previewData);
      toast({ title: "Base de dados substituída!", description: `${previewData.length} registros foram carregados.` });
    } else {
      onImport(previewData);
      toast({ title: "Membros adicionados!", description: `${previewData.length} novos registros foram adicionados.` });
    }
    setShowPreview(false);
    setPreviewData([]);
  };
  
    const cancelImport = () => {
        setShowPreview(false);
        setPreviewData([]);
    };

    const handleExportPDF = () => {
        const membersToExport = filteredMembers ?? members;
        exportToPDF(membersToExport, filters, 'relatorio-membros');
    };

    const downloadTemplate = () => {
        // Implementação da função de download do template
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Importar e Exportar Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" onClick={() => fileInputRef.current?.click()} disabled={loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Processando...' : 'Carregar Arquivo (XLSX, CSV)'}
            </Button>
            <Button size="lg" onClick={handleGoogleSheetImport} disabled={loading} variant="outline">
                <LinkIcon className="h-4 w-4 mr-2" />
                {loading ? 'Sincronizando...' : 'Importar do Google Sheets'}
            </Button>
        </div>
        <Input
            id="upload-file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            disabled={loading}
            ref={fileInputRef}
            className="hidden"
        />
        {uploadProgress > 0 && (
          <div className="w-full">
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {showPreview && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Revisão da Importação</AlertTitle>
            <AlertDescription className="space-y-4 mt-2">
                <p className="text-sm">
                  Encontrados {previewData.length} registros. Confira os 5 primeiros abaixo:
                </p>

                <div className="bg-muted/50 rounded p-3 text-xs space-y-1 max-h-32 overflow-y-auto">
                  {previewData.slice(0, 5).map((member, index) => (
                    <div key={index} className="flex gap-4 p-1 border-b border-muted">
                      <span className="font-medium w-1/3 truncate">{member.nome}</span>
                      <span className="w-1/4 truncate">{member.bairro}</span>
                      <span className="w-1/4 truncate">{member.status}</span>
                      <span className="w-1/4 truncate">{member.batizado ? 'Batizado' : 'Não Bat.'}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={() => confirmImport(false)} size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    Adicionar aos Existentes
                  </Button>
                  <Button onClick={() => confirmImport(true)} variant="destructive" size="sm">
                    <Database className="h-3 w-3 mr-1" />
                    Substituir Base de Dados
                  </Button>
                  <Button onClick={cancelImport} variant="ghost" size="sm">
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => exportToExcel(members, 'membros-exportados')} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exportar para Excel
          </Button>
          <Button onClick={handleExportPDF} variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Exportar para PDF
          </Button>
          <Button variant="outline" onClick={downloadTemplate} className="w-full">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Baixar Template
          </Button>
        </div>
        
        <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Instruções</AlertTitle>
            <AlertDescription className="text-xs">
              Para importar, sua planilha deve conter as colunas obrigatórias: `nome`, `data_nascimento`, `sexo`, `bairro`, `situacao_atual`, `batizado`, `membro`.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};