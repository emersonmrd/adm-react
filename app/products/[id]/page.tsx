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

export default function ProductDetails() {
  // Usado o useParams para acessar o parâmetro 'id' da URL
  const { id } = useParams();

  // Insatancia o objeto router
  const router = useRouter();

  // Estado para armazenar o usuário
  const [product, setProduct] = useState<Product | null>(null);

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);

  // Função para buscar os users da API
  const fetchProductDetails = async (id: string) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/products/${id}`);

      // Atualizar o estado com os dados da API
      setProduct(response.data);

      // Termina o carregamento
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Se for uma única mensagem atribuir a mensagem de erro retornada da API
        setError(error.response.data.message);
      } else {
        // Criar a mensagem genérica de erro
        setError("Erro ao carregar os detalhes do Produto");
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
    router.push("/products/list");
  };

  // Hook para buscar os dados quando o id estiver disponível
  useEffect(() => {
    if (id) {
      // Garantir que o id seja uma string
      const userId = Array.isArray(id) ? id[0] : id;
      // Busca os dados do usuer se o id estiver disponível
      fetchProductDetails(userId);
    }
  }, [id]); // Recarrega os dados quando o id mudar

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
              <a href="/products/list" className="breadcrumb-link">
                Produtos
              </a>
              <span> / </span>
              <span>Visualizar</span>
            </nav>
          </div>
        </div>

        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Visualizar</h3>
            <div className="content-box-btn"></div>
          </div>
          <div className="content-box-body">
            {/* Exibir o carregando */}
            {loading && <LoadingSpinner />}

            {/* Exibe mensagem de erro*/}
            <AlertMessage type="error" message={error} />
            {/* Exibe mensagem de sucesso */}
            <AlertMessage type="success" message={success} />
            {/* Imprimir os detalhes do registro */}
            {product && !loading && !error && (
              <div>
                <p>ID: {product.id}</p>
                <p>Nome do Produto: {product.name}</p>
                <p>Slug: {product.slug}</p>
                <p>Descrição: {product.description}</p>
                <p>Preço: {`R$${product.price}`}</p>
                <p>Situação: {product.situation.name}</p>
                <p>Categoria: {product.category.name}</p>
                <p>Criado em: {new Date(product.createdAt).toLocaleString()}</p>
                <p>Editado:{new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            )}
            {product && !loading && !error && (
              <DeleteButton
                id={String(product.id)}
                route="products"
                onSuccess={handleSuccess}
                setError={setError}
                setSuccess={setSuccess}
              />
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
