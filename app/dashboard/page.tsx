// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa o componente com o Menu
import Menu from "@/app/components/Menu";
// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function dashboard() {
  return (
    <ProtectedRoute>
      <Menu />
      <br />
      <h1>Dashboard</h1>
    </ProtectedRoute>
  );
}
