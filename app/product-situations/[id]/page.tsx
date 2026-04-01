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

// Importa o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente link do next
import Link from "next/link";

// Importa o componente para apagar registro
import DeleteButton from "@/app/components/DeleteButton";

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
  const [sucess, setSucess] = useState<string | null>(null);

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
  const handleSucess = () => {
    //Salvar a mensagem no sessionStorage antes de redirecionar
    sessionStorage.setItem("sucessMessage", "Registro apagado com sucesso.");

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
    <div>
      <Menu />
      <br />

      <Link href={`/product-situations/list`}>Listar</Link>
      <br />

      <Link href={`/product-situations/${id}/edit`}>Editar</Link>

      {productSituation && !loading && !error && (
        <DeleteButton
          id={String(productSituation.id)}
          route="product-situations"
          onSucess={handleSucess}
          setError={setError}
          setSucess={setSucess}
        />
      )}

      <h1>Detalhes da Situação do Produto</h1>

      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe mensagem de erro*/}
      {error && <p style={{ color: "#F00" }}>{error}</p>}
      {/* Exibe mensagem de sucesso */}
      {sucess && <p style={{ color: "#086" }}>{sucess}</p>}
      {/* Imprimir os detalhes do registro */}
      {productSituation && !loading && !error && (
        <div>
          <p>ID: {productSituation.id}</p>
          <p>Situação do Produto: {productSituation.name}</p>
          <p>
            Criado em: {new Date(productSituation.createdAt).toLocaleString()}
          </p>
          <p>Editado:{new Date(productSituation.updatedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
