// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente com a paginação
import Pagination from "@/app/components/Pagination";

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
interface Situation {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  situation: Situation;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export default function ProductList() {
  // Estado para armazenar as situações
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);
  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);
  // Página atual
  const [currentPage, setCurrentPage] = useState<number>(1);
  // última página
  const [lastPage, setLastPage] = useState<number>(1);

  // Função para buscar as situações da API
  const fetchProducts = async (page: number) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/products?page=${page}&limit=1`);

      // Atualizar o estado com os dados da API
      setProducts(response.data.data);

      // Atualiza a página atual
      setCurrentPage(response.data.currentPage);

      // Atualiza a última página
      setLastPage(response.data.lastPage);

      // Termina o carregamento
      setLoading(false);
    } catch (error) {
      // Criar a mensagem genérica de erro
      setError("Erro ao carregar os produtos");
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  // Atualizar a lista de registro após apagar o registro
  const handleSuccess = () => {
    fetchProducts(currentPage);
  };

  // Hook para buscar os dados na primeira renderização
  useEffect(() => {
    // Recuperar a mensagem salva no sessionStorage
    const message = sessionStorage.getItem("successMessage");

    // Verificar se existe a mensagem
    if (message) {
      // Atribuir a mensagem
      setSuccess(message);
      // Remover para evitar duplicação
      sessionStorage.removeItem("successMessage");
    }

    // Busca os dados ao carregar a página
    fetchProducts(currentPage);
  }, [currentPage]); // Recarregar os dados sempre que a página for alterada

  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Produto</h2>
            <nav className="breadcrumb">
              <a href="/dashboard" className="breadcrumb-link">
                Dashboard
              </a>
              <span> / </span>
              <span>Produtos</span>
            </nav>
          </div>
        </div>

        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Listar</h3>
            <div className="content-box-btn">
              <Link href="/products/create" className="btn-primary-md">
                +Novo Produto
              </Link>
            </div>
          </div>
          <div className="content-box-body">
            {/* Exibir o carregando */}
            {loading && <LoadingSpinner />}

            {/* Exibe mensagem de erro*/}
            <AlertMessage type="error" message={error} />
            {/* Exibe mensagem de sucesso */}
            <AlertMessage type="success" message={success} />

            {!loading && !error && (
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Produto</th>
                    <th>Slug</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th>Situação</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.slug}</td>
                      <td>{product.description}</td>
                      <td>{`R$${product.price}`}</td>
                      <td>{product.situation.name}</td>
                      <td>{product.category.name}</td>
                      <td>
                        <Link href={`/products/${product.id}`}>Visualizar</Link>
                        {` - `}
                        <Link href={`/products/${product.id}/edit`}>
                          Editar
                        </Link>
                        {` - `}
                        <DeleteButton
                          id={String(product.id)}
                          route="products"
                          onSuccess={handleSuccess}
                          setError={setError}
                          setSuccess={setSuccess}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Usar o componente de Paginação */}
          <div>
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
