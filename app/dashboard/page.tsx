// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa o componente com o layout
import Layout from "@/app/components/Layout";

export default function dashboard() {
  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Dashboard</h2>
            <nav className="breadcrumb">
              <span>Dashboard</span>
            </nav>
          </div>
        </div>

        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Página Inicial</h3>
            <div className="content-box-btn"></div>
          </div>
          <div className="content-box-body">Bem-vindo...</div>
        </div>
      </main>
    </Layout>
  );
}
