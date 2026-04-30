// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

// Impora a instância do axios configurada para fazer requisições para a API
import instance from "@/services/api";

export default function useAuth() {
  // Insatancia o objeto router
  const router = useRouter();

  // Estado para armazenar a autenticação
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);

  // Hook para buscar os dados quando o id estiver disponível
  useEffect(() => {
    // Recuperar o token do localStorage
    const token = localStorage.getItem("token");

    // Verificar se o token existe
    if (!token) {
      // Redirecionar para o login se não estiver autenticado
      router.push("/login");
    }

    // Verifica a validade do token na API
    const validateToken = async () => {
      try {
        // Fazer a requisição à API
        await instance.get("/validate-token");

        // Atribuir a situação da autenticação
        setAuthenticated(true);
      } catch (error) {
        // Remove o token inválido enviado pelo usuário
        localStorage.removeItem("token");
        // Redirecionar para o login se o token for inválido
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    // Chamar a função validar token
    validateToken();
  }, []);

  // Retornar a situação da autenticação
  return {
    authenticated,
    loading,
  };
}
