// Local do arquivo: src/App.tsx

import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { Layout } from "@/components/layout/Layout";
import Management from "@/pages/Management";
import Analytics from "@/pages/Analytics";
// ✅ CORREÇÃO: Removidas as chaves da importação
import CalendarPage from "@/pages/CalendarPage"; 
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </HashRouter>
    </AppProvider>
  );
}

export default App;