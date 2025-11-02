// Local do arquivo: src/App.tsx

import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/PostgreSQLContext";
import { Layout } from "@/components/layout/Layout";
import Management from "@/pages/Management";
import Analytics from "@/pages/Analytics";
// ✅ CORREÇÃO: Removidas as chaves da importação
import CalendarPage from "@/pages/CalendarPage"; 
import ImportacaoPage from "@/pages/ImportacaoPage";
import NotFound from "@/pages/NotFound";
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Management />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="importacao" element={<ImportacaoPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </HashRouter>
    </AppProvider>
  );
}

export default App;