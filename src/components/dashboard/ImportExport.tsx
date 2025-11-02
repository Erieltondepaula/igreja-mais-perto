// Local do arquivo: src/components/dashboard/ImportExport.tsx
// ✅ CÓDIGO CORRIGIDO E SIMPLIFICADO

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Member, MemberFilters } from '@/types/member';
import { importFromExcel, exportToExcel } from '@/utils/excelUtils';
import { exportToPDF } from '@/utils/pdfUtils';
import { Upload, Download, Database, FileText } from 'lucide-react';
import { useRef, useState } from 'react';

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
  const [loading, setLoading] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const importedMembers = await importFromExcel(file);
      // Usamos a função onImport, que agora substitui os dados.
      onImport(importedMembers); 
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
        toast({
            title: "Erro ao carregar arquivo",
            description: `Falha ao processar a planilha. Detalhe: ${errorMessage}`,
            variant: "destructive"
        });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExportPDF = () => {
    const membersToExport = filteredMembers ?? members;
    const logoUrlRaw = localStorage.getItem('church-logo');
    const churchNameRaw = localStorage.getItem('church-name');
    const logoUrl = logoUrlRaw ? JSON.parse(logoUrlRaw) : null;
    const churchName = churchNameRaw ? JSON.parse(churchNameRaw) : 'Relatório de Membros';
    exportToPDF(membersToExport, filters, logoUrl, churchName, 'relatorio-membros');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Importar e Exportar Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ✅ AGORA SÓ TEMOS UM BOTÃO DE IMPORTAR QUE SUBSTITUI */}
            <Button size="lg" onClick={() => fileInputRef.current?.click()} disabled={loading} className="md:col-span-1">
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Processando...' : 'Importar Planilha (Substitui Tudo)'}
            </Button>
            <Button size="lg" onClick={() => exportToExcel(filteredMembers ?? members, 'membros-exportados')} variant="outline" className="md:col-span-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar para Excel (XLSX)
            </Button>
            <Button size="lg" onClick={handleExportPDF} variant="outline" className="md:col-span-1">
              <FileText className="h-4 w-4 mr-2" />
              Exportar para PDF
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
      </CardContent>
    </Card>
  );
};