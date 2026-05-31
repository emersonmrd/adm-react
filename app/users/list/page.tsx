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
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserList() {
  // Estado para armazenar as situações
  const [user, setUser] = useState<User[]>([]);
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
  const fetchUsers = async (page: number) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/users?page=${page}&limit=10`);

      // Atualizar o estado com os dados da API
      setUser(response.data.data);

      // Atualiza a página atual
      setCurrentPage(response.data.currentPage);

      // Atualiza a última página
      setLastPage(response.data.lastPage);

      // Termina o carregamento
      setLoading(false);
    } catch (error) {
      // Criar a mensagem genérica de erro
      setError("Erro ao carregar os usuários.");
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  // Atualizar a lista de registro após apagar o registro
  const handleSuccess = () => {
    fetchUsers(currentPage);
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
    fetchUsers(currentPage);
  }, [currentPage]); // Recarregar os dados sempre que a página for alterada

  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Usuário</h2>
            <nav className="breadcrumb">
              <a href="/dashboard" className="breadcrumb-link">
                Dashboard
              </a>
              <span> / </span>
              <span>Usuários</span>
            </nav>
          </div>
        </div>

        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Listar</h3>
            <div className="content-box-btn">
              <Link href="/users/create" className="btn-success aling-icon-btn">
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span>Cadastrar</span>
              </Link>
            </div>
          </div>
          {/* Exibir o carregando */}
          {loading && <LoadingSpinner />}

          {/* Exibe mensagem de erro*/}
          <AlertMessage type="error" message={error} />
          {/* Exibe mensagem de sucesso */}
          <AlertMessage type="success" message={success} />
          <div className="table-container">
            {!loading && !error && (
              <table className="table">
                <thead>
                  <tr className="table-row-header">
                    <th className="table-header">ID</th>
                    <th className="table-header">Nome</th>
                    <th className="table-header hidden lg:table-cell">Email</th>
                    <th className="table-header-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((user) => (
                    <tr className="table-row-body" key={user.id}>
                      <td className="table-body">{user.id}</td>
                      <td className="table-body">{user.name}</td>
                      <td className="table-body hidden lg:table-cell">
                        {user.email}
                      </td>
                      <td className="table-body-actions">
                        <Link
                          className="btn-primary aling-icon-btn"
                          href={`/users/${user.id}`}
                        >
                          <svg
                            className="size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          <span>Visualizar</span>
                        </Link>
                        <Link
                          className="btn-warning table-md-hidden "
                          href={`/users/${user.id}/edit`}
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
                        <span className="table-md-hidden">
                          <DeleteButton
                            id={String(user.id)}
                            route="users"
                            onSuccess={handleSuccess}
                            setError={setError}
                            setSuccess={setSuccess}
                          />
                        </span>
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
