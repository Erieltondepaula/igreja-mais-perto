import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/types/member';
import { exportToExcel, importFromExcel } from '@/utils/excelUtils';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImportExportProps {
  members: Member[];
  onImport: (members: Partial<Member>[]) => void;
}

export const ImportExport = ({ members, onImport }: ImportExportProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleExportAll = () => {
    exportToExcel(members, 'todos-membros');
    toast({
      title: "Exportação concluída",
      description: "Arquivo Excel baixado com sucesso!"
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const importedMembers = await importFromExcel(file);
      onImport(importedMembers);
      toast({
        title: "Importação concluída",
        description: `${importedMembers.length} membros importados com sucesso!`
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar o arquivo. Verifique o formato.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
          <FileSpreadsheet className="h-5 w-5" />
          Importar / Exportar Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={handleExportAll} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exportar Todos
          </Button>

          <Button variant="outline" onClick={downloadTemplate} className="w-full">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Baixar Template
          </Button>

          <div className="space-y-2">
            <Label htmlFor="import-file">Importar Arquivo</Label>
            <div className="flex gap-2">
              <Input
                id="import-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                disabled={importing}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? 'Importando...' : 'Selecionar Arquivo'}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Instruções:</strong></p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Use o template para garantir o formato correto</li>
            <li>Data de nascimento no formato: AAAA-MM-DD</li>
            <li>Sexo: "Masculino" ou "Feminino"</li>
            <li>Status: "ativo", "batizado", "membro" ou "desligado"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};