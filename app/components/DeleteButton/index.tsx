// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas
import { useParams } from "next/navigation";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

interface DeleteButtonProps {
  id: string; // ID da situação a ser excluída
  route: string; // Rota para requisição
  onSuccess?: () => void; // Função de callback após sucesso
  setError: (message: string | null) => void; // Função de callback para retornar mensagem de erro
  setSuccess: (message: string | null) => void; // Função de callback para retornar mensagem de sucesso
}

const DeleteButton = ({
  id,
  route,
  onSuccess,
  setError,
  setSuccess,
}: DeleteButtonProps) => {
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    // Evita múltiplos cliques
    if (loading) return;

    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSuccess(null);

    try {
      // Fazer a requisição à API
      const response = await instance.delete(`/${route}/${id}`);

      // Exibir mensagem de sucesso
      setSuccess(response.data.message || "Registro apagado com sucesso!");

      // Chama a função de sucesso, se estiver definida
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      // Verifica se o erro contém mensagens de validação
      setError(error.response?.data?.message || "Erro ao apagar o registro!");
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

  return (
    <button
      className="btn-danger aling-icon-btn"
      onClick={handleDelete}
      disabled={loading}
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
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>

      {loading ? "Excluindo..." : "Apagar"}
    </button>
  );
};

export default DeleteButton;
