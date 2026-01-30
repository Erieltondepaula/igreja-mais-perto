import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/contexts/PostgreSQLContext';
import { Layout } from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Analytics from '@/pages/Analytics';
import CalendarPage from '@/pages/CalendarPage';
import ImportacaoPage from '@/pages/ImportacaoPage';
import ConversorPage from '@/pages/ConversorPage';
import { ChurchSettings } from '@/pages/ChurchSettings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="importacao" element={<ImportacaoPage />} />
                <Route path="conversor" element={<ConversorPage />} />
                <Route path="configuracoes" element={<ChurchSettings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
