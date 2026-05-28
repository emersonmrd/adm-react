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
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Excluindo..." : "Apagar"}
      </button>
    </div>
  );
};

export default DeleteButton;
