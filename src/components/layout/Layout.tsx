// Local do arquivo: src/components/layout/Layout.tsx
// ✅ CÓDIGO FINAL COM O CALENDÁRIO DE VOLTA NA SIDEBAR

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart2, Users, CalendarDays, Upload, FileSpreadsheet } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { useAppContext } from "@/contexts/useAppContext";
import { AppCalendar } from "@/components/dashboard/Calendar"; // Importar o calendário da sidebar
import { ScrollArea } from "@/components/ui/scroll-area"; 

export const Layout = () => {
  const { members, onFiltersChange, filters } = useAppContext();
  const navigate = useNavigate();

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    console.log('🔵 Card clicado:', statusGeral);
    
    // Primeiro navega para a página principal
    navigate('/');
    
    // Aguarda um momento para a navegação completar, depois aplica o filtro
    setTimeout(() => {
      onFiltersChange({ statusGeral });
      console.log('🔵 Filtro aplicado:', { statusGeral });
      
      // Faz scroll para a lista de membros
      const memberList = document.querySelector('[data-member-list]');
      if (memberList) {
        memberList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ✅ Aumentar a largura da sidebar novamente */}
      <aside className="w-80 bg-card border-r flex flex-col">
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center">Menu</h1>
            <nav className="flex flex-col gap-2 mt-4">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive && "bg-muted text-primary"}`}>
                <Users className="h-4 w-4" /> Gerenciamento
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive && "bg-muted text-primary"}`}>
                <BarChart2 className="h-4 w-4" /> Gráficos e Análises
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive && "bg-muted text-primary"}`}>
                <CalendarDays className="h-4 w-4" /> Calendário Completo
            </NavLink>
            <NavLink to="/importacao" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive && "bg-muted text-primary"}`}>
                <Upload className="h-4 w-4" /> Importação Interativa
            </NavLink>
            <NavLink to="/conversor" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive && "bg-muted text-primary"}`}>
                <FileSpreadsheet className="h-4 w-4" /> Conversor de Arquivos
            </NavLink>
            </nav>
        </div>
        {/* ✅ ADICIONAR O CALENDÁRIO DE VOLTA À SIDEBAR */}
        <ScrollArea className="flex-1">
            <AppCalendar />
        </ScrollArea>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b">
           <Header members={members} onCardClick={handleCardClick} />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};