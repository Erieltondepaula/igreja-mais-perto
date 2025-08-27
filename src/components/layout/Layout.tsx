// Local do arquivo: src/components/layout/Layout.tsx

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart2, Users } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { useAppContext } from "@/contexts/useAppContext";

export const Layout = () => {
  const { members, onFiltersChange, filters } = useAppContext();
  const navigate = useNavigate();

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    navigate('/');
    onFiltersChange({ ...filters, statusGeral });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Menu</h1>
        <nav className="flex flex-col gap-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive && "bg-muted text-primary"}`}>
            <Users className="h-4 w-4" /> Gerenciamento
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive && "bg-muted text-primary"}`}>
            <BarChart2 className="h-4 w-4" /> Gráficos e Análises
          </NavLink>
        </nav>
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