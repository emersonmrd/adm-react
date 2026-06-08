// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente com o layout
import Layout from "@/app/components/Layout";

// Importa o componente LoadingSpinner
import LoadingSpinner from "@/app/components/LoadingSpinner";

// Importa o componente de alerta
import AlertMessage from "@/app/components/AlertMessage";

// Importar o componente com o gráfico dos usuários cadastrados mensalmente
import UserBarChat from "@/app/components/Graphic/User/BarChart";

// Importar o componente com o gráfico dos usuários cadastrados mensalmente
import ProductAreaChart from "@/app/components/Graphic/Product/AreaChart";

// Definir tipos para os addos dos gráficos
interface UsersReport {
  month: string;
  users: number;
}

interface ProductsReport {
  month: string;
  products: number;
}

export default function dashboard() {
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);
  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);
  // Estado para armazenar os dados do gráfico usuários
  const [usersReport, setUsersReport] = useState<UsersReport[]>([]);
  // Estado para armazenar os dados do gráfico produtos
  const [productsReport, setProductsReport] = useState<ProductsReport[]>([]);

  const fetchReports = async () => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Limpa o erro anterior
      setError(null);

      // Limpa o sucesso anterior
      setSuccess(null);

      // Fazer múltiplas requisições simultaneamente
      const [usersReport, productsReport] = await Promise.all([
        instance.get(`/users-report`),
        instance.get(`/products-report`),
      ]);

      // Atribuir os dados que a API retornou
      setUsersReport(usersReport.data);
      setProductsReport(productsReport.data);

      // Termina o carregamento
      setLoading(false);
    } catch (error) {
      // Criar a mensagem genérica de erro
      setError("Erro ao carregar os dados do Dashboard!.");
    } finally {
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  // Buscar os dados ao carregar a página
  useEffect(() => {
    fetchReports();
  }, []);

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

          {/* Exibir o carregando */}
          {loading && <LoadingSpinner />}

          {/* Exibe mensagem de erro*/}
          <AlertMessage type="error" message={error} />
          {/* Exibe mensagem de sucesso */}
          <AlertMessage type="success" message={success} />

          <div className="flex flex-col md:flex-row items-center justify-center py-5 gap-5">
            <div className="w-full md:w-1/2">
              <UserBarChat data={usersReport} />
            </div>
            <div className="w-full md:w-1/2">
              <ProductAreaChart data={productsReport} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
