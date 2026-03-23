// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Definir tipos para a respota da API
interface ProductCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductCategoryList() {
  // Estado para armazenar as categorias do produto
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    [],
  );
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);
  // Página atual
  const [currentPage, setCurrentPage] = useState<number>(1);
  // última página
  const [lastPage, setLastPage] = useState<number>(1);

  // Função para buscar as categorias do produto da API
  const fetchProductCategories = async (page: number) => {
    try {
      // Inicia o carregamento
      // setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(
        `/product-categories?page=${page}&limit=10`,
      );

      // Atualizar o estado com os dados da API
      setProductCategories(response.data.result.data);

      // Atualiza a página atual
      setCurrentPage(response.data.currentPage);

      // Atualiza a última página
      setCurrentPage(response.data.lastPage);

      // Termina o carregamento
      setLoading(false);
    } catch (error) {
      setError("Erro ao carregar as situações");
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  // Hook para buscar os dados na primeira renderização
  useEffect(() => {
    // Busca os dados ao carregar a página
    fetchProductCategories(currentPage);
  }, [currentPage]); // Recarregar os dados sempre que a página for alterada

  return (
    <div>
      <h1>Listar as Categorias dos Produtos</h1>
      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe erro, se houver */}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Categoria do Produto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {productCategories.map((productCategory) => (
              <tr key={productCategory.id}>
                <td>{productCategory.id}</td>
                <td>{productCategory.name}</td>
                <td>Visualizar - Editar - Apagar</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
