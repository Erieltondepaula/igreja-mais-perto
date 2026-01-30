import React from 'react';
import ImportacaoInterativa from '@/components/ImportacaoInterativa';
import { GoogleSheetsSync } from '@/components/dashboard/GoogleSheetsSync';
import { ImportExport } from '@/components/dashboard/ImportExport';
import { useAppContext } from '@/contexts/useAppContext';

const ImportacaoPage: React.FC = () => {
  const { members, filters, onImport, onReplaceAll } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* 🔄 Sincronização Google Sheets */}
        <GoogleSheetsSync />
        
        {/* 📤 Importação Manual (XLSX/CSV) */}
        <ImportExport 
          members={members}
          filters={filters}
          onImport={onImport}
          onReplaceAll={onReplaceAll}
        />
        
        {/* 📋 Importação Interativa Manual */}
        <ImportacaoInterativa />
      </div>
    </div>
  );
};

export default ImportacaoPage;