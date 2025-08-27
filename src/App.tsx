// Local do arquivo: src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { Layout } from "@/components/layout/Layout";
import Management from "@/pages/Management";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/NotFound";
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Management />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;