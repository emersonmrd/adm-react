// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importar o componente da Navbar
import Navbar from "@/app/components/Navbar";

// Importar o componente da Sidebar
import Sidebar from "@/app/components/Sidebar";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

// Importa hooks do React para usar o estado "useState", os efeitos colaterais "useEffect" e useRef para criar uma referência ao elemento.
import { useEffect, useRef, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Estado para controlar a sidebar aberta ou fechada
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="bg-dashboard">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
