// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente com a paginação
import Pagination from "@/app/components/Pagination";

// Importa o componente link do next
import Link from "next/link";

// Importa o componente para apagar registro
import DeleteButton from "@/app/components/DeleteButton";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

// Definir tipos para a respota da API
interface ProductSituation {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductSituationList() {
  // Estado para armazenar as situações do produto
  const [productSituations, setProductSituations] = useState<
    ProductSituation[]
  >([]);
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);
  // Estado para controle de sucesso
  const [sucess, setSucess] = useState<string | null>(null);
  // Página atual
  const [currentPage, setCurrentPage] = useState<number>(1);
  // última página
  const [lastPage, setLastPage] = useState<number>(1);

  // Função para buscar as situações do produto da API
  const fetchProductSituations = async (page: number) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(
        `/product-situations?page=${page}&limit=1`,
      );

      // Atualizar o estado com os dados da API
      setProductSituations(response.data.result.data);

      // Atualiza a página atual
      setCurrentPage(response.data.result.currentPage);

      // Atualiza a última página
      setLastPage(response.data.result.lastPage);

      // Termina o carregamento
      setLoading(false);
    } catch (error) {
      // Criar a mensagem genérica de erro
      setError("Erro ao carregar as situações do produto");
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  // Atualizar a lista de registro após apagar o registro
  const handleSucess = () => {
    fetchProductSituations(currentPage);
  };

  // Hook para buscar os dados na primeira renderização
  useEffect(() => {
    // Recuperar a mensagem salva no sessionStorage
    const message = sessionStorage.getItem("sucessMessage");

    // Verificar se existe a mensagem
    if (message) {
      // Atribuir a mensagem
      setSucess(message);
      // Remover para evitar duplicação
      sessionStorage.removeItem("sucessMessage");
    }

    // Busca os dados ao carregar a página
    fetchProductSituations(currentPage);
  }, [currentPage]); // Recarregar os dados sempre que a página for alterada

  return (
    <ProtectedRoute>
      <Menu />
      <br />
      <Link href={`/product-situations/create`}>Cadastrar</Link>
      <h1>Listar as Situações dos Produtos</h1>
      <br />
      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe mensagem de erro*/}
      {error && <p style={{ color: "#F00" }}>{error}</p>}
      {/* Exibe mensagem de sucesso */}
      {sucess && <p style={{ color: "#086" }}>{sucess}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Situação do Produto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {productSituations.map((productSituation) => (
              <tr key={productSituation.id}>
                <td>{productSituation.id}</td>
                <td>{productSituation.name}</td>
                <td>
                  <Link href={`/product-situations/${productSituation.id}`}>
                    Visualizar
                  </Link>
                  {` - `}
                  <Link
                    href={`/product-situations/${productSituation.id}/edit`}
                  >
                    Editar
                  </Link>
                  {` - `}
                  <DeleteButton
                    id={String(productSituation.id)}
                    route="product-situations"
                    onSucess={handleSucess}
                    setError={setError}
                    setSucess={setSucess}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Usar o componente de Paginação */}
      <br />
      <div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </ProtectedRoute>
  );
}
