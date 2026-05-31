// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas
import { useParams } from "next/navigation";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente link do next
import Link from "next/link";

// Importa o componente para apagar registro
import DeleteButton from "@/app/components/DeleteButton";

// Importa o componente de layout
import Layout from "@/app/components/Layout";

// Importa o componente LoadingSpinner
import LoadingSpinner from "@/app/components/LoadingSpinner";

// Importa o componente de alerta
import AlertMessage from "@/app/components/AlertMessage";

// Definir tipos para a respota da API
interface ProductSituation {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductSituationDetails() {
  // Usado o useParams para acessar o parâmetro 'id' da URL
  const { id } = useParams();

  // Insatancia o objeto router
  const router = useRouter();

  // Estado para armazenar a situação do produto
  const [productSituation, setProductSituation] =
    useState<ProductSituation | null>(null);

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);

  // Função para buscar a situação da API
  const fetchProductSituationDetails = async (id: string) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/product-situations/${id}`);

      // Atualizar o estado com os dados da API
      setProductSituation(response.data);

      // Termina o carregamento
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Se for uma única mensagem atribuir a mensagem de erro retornada da API
        setError(error.response.data.message);
      } else {
        // Criar a mensagem genérica de erro
        setError("Erro ao carregar os detalhes da situação do produto");
      }
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  // Redirecionar para a página listar após apagar o registro
  const handleSuccess = () => {
    //Salvar a mensagem no sessionStorage antes de redirecionar
    sessionStorage.setItem("successMessage", "Registro apagado com sucesso.");

    // Redireciona para a página de listar
    router.push("/product-situations/list");
  };

  // Hook para buscar os dados quando o id estiver disponível
  useEffect(() => {
    if (id) {
      // Garantir que o id seja uma string
      const productSituationId = Array.isArray(id) ? id[0] : id;
      // Busca os dados da situação do produto se o id estiver disponível
      fetchProductSituationDetails(productSituationId);
    }
  }, [id]); // Recarrega os dados quando o id mudar

  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Situação Produto</h2>
            <nav className="breadcrumb">
              <a href="/dashboard" className="breadcrumb-link">
                Dashboard
              </a>
              <span> / </span>
              <a href="/product-situations/list" className="breadcrumb-link">
                Situações Produtos
              </a>
              <span> / </span>
              <span>Visualizar</span>
            </nav>
          </div>
        </div>

        {/* Exibir o carregando */}
        {loading && <LoadingSpinner />}

        {/* Exibe mensagem de erro*/}
        <AlertMessage type="error" message={error} />
        {/* Exibe mensagem de sucesso */}
        <AlertMessage type="success" message={success} />

        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Visualizar</h3>
            <div className="content-box-btn">
              <Link
                href="/product-situations/list"
                className="btn-info aling-icon-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99"
                  />
                </svg>
                <span>Listar</span>
              </Link>
              <Link
                className="btn-warning aling-icon-btn"
                href={`/product-situations/${id}/edit`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>

                <span>Editar</span>
              </Link>
            </div>
          </div>

          {/* Imprimir os detalhes do registro */}
          {productSituation && !loading && !error && (
            <div className="detail-box">
              <div className="mb-1">
                <span className="detail-content">ID:</span>{" "}
                {productSituation.id}
              </div>
              <div className="mb-1">
                <span className="detail-content">Situação do Produto:</span>{" "}
                {productSituation.name}
              </div>
              <div className="mb-1">
                <span className="detail-content">Criado em:</span>{" "}
                {new Date(productSituation.createdAt).toLocaleString()}
              </div>
              <div className="mb-1">
                <span className="detail-content">Editado:</span>{" "}
                {new Date(productSituation.updatedAt).toLocaleString()}
              </div>
            </div>
          )}
          {productSituation && !loading && !error && (
            <DeleteButton
              id={String(productSituation.id)}
              route="product-situations"
              onSuccess={handleSuccess}
              setError={setError}
              setSuccess={setSuccess}
            />
          )}
        </div>
      </main>
    </Layout>
  );
}
