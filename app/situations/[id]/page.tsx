// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas
import { useParams } from "next/navigation";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente link do next
import Link from "next/link";

// Definir tipos para a respota da API
interface Situation {
  id: number;
  nameSituation: string;
  createdAt: string;
  updatedAt: string;
}

export default function SituationDetails() {
  // Usado o useParams para acessar o parâmetro 'id' da URL
  const { id } = useParams();

  // Estado para armazenar a situação
  const [situation, setSituation] = useState<Situation | null>(null);

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Função para buscar as situação da API
  const fetchSituationDetails = async (id: string) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/situations/${id}`);

      // Atualizar o estado com os dados da API
      setSituation(response.data);

      // Termina o carregamento
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Se for uma única mensagem atribuir a mensagem de erro retornada da API
        setError(error.response.data.message);
      } else {
        // Criar a mensagem genérica de erro
        setError("Erro ao carregar os detalhes da situação");
      }
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };
  // Hook para buscar os dados quando o id estiver disponível
  useEffect(() => {
    if (id) {
      // Garantir que o id seja uma string
      const situationId = Array.isArray(id) ? id[0] : id;
      // Busca os dados da situação se o id estiver disponível
      fetchSituationDetails(situationId);
    }
  }, [id]); // Recarrega os dados quando o id mudar

  return (
    <div>
      <Menu />
      <br />

      <Link href={`/situations/list`}>Listar</Link>

      <h1>Detalhes da situação</h1>

      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe erro, se houver */}
      {error && <p>{error}</p>}
      {/* Imprimir os detalhes do registro */}
      {situation && !loading && !error && (
        <div>
          <p>ID: {situation.id}</p>
          <p>Nome da Situação: {situation.nameSituation}</p>
          <p>Criado em: {new Date(situation.createdAt).toLocaleString()}</p>
          <p>Editado:{new Date(situation.updatedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
