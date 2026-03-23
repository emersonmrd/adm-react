// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa o componente com o Menu
import Menu from "@/app/components/Menu";
// Importa o componente com a paginação
import Pagination from "@/app/components/Pagination";

// Definir tipos para a respota da API
interface Situation {
  id: number;
  nameSituation: string;
  createdAt: string;
  updatedAt: string;
}

export default function SituationList() {
  // Estado para armazenar as situações
  const [situations, setSituations] = useState<Situation[]>([]);
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);
  // Página atual
  const [currentPage, setCurrentPage] = useState<number>(1);
  // última página
  const [lastPage, setLastPage] = useState<number>(1);

  // Função para buscar as situações da API
  const fetchSituations = async (page: number) => {
    try {
      // Inicia o carregamento
      // setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/situations?page=${page}&limit=1`);

      // Atualizar o estado com os dados da API
      setSituations(response.data.data);

      // Atualiza a página atual
      setCurrentPage(response.data.currentPage);

      // Atualiza a última página
      setLastPage(response.data.lastPage);

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
    fetchSituations(currentPage);
  }, [currentPage]); // Recarregar os dados sempre que a página for alterada

  return (
    <div>
      <Menu />
      <br />

      <h1>Listar as situações</h1>
      <br />
      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe erro, se houver */}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome da Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {situations.map((situaton) => (
              <tr key={situaton.id}>
                <td>{situaton.id}</td>
                <td>{situaton.nameSituation}</td>
                <td>Visualizar - Editar - Apagar</td>
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
    </div>
  );
}
