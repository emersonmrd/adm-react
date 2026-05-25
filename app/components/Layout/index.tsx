// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importar o componente da Navbar
import Navbar from "@/app/components/Navbar";

// Importar o componente da Sidebar
import Sidebar from "@/app/components/Sidebar";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <div className="bg-dashboard">
        <Navbar />

        <div className="flex">
          <Sidebar />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
