import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Church } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const Header = () => {
  const [logoUrl, setLogoUrl] = useLocalStorage<string>('church-logo', '');
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoUrl(result);
      setUploading(false);
    };

    reader.onerror = () => {
      setUploading(false);
      // Opcional: adicionar tratamento de erro, exibir mensagem para usuário
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className="rounded-xl shadow-md p-4 mb-6 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo da Igreja"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                <Church className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <label
              htmlFor="logo-upload"
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              aria-label="Alterar logotipo da igreja"
            >
              <Upload className="h-4 w-4 text-white" />
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                aria-hidden="true"
              />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard de Membros</h1>
            {!logoUrl && (
              <p className="text-sm text-muted-foreground">
                Adicione o logotipo da sua igreja
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('logo-upload')?.click()}
          disabled={uploading}
          className="rounded-xl"
          aria-label="Alterar logotipo da igreja"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Carregando...' : 'Alterar Logotipo'}
        </Button>
      </div>
    </Card>
  );
};
