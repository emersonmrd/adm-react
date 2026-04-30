// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

export default function useAuth() {
  // Insatancia o objeto router
  const router = useRouter();

  // Estado para armazenar a autenticação
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Hook para buscar os dados quando o id estiver disponível
  useEffect(() => {
    // Recuperar o token do localStorage
    const token = localStorage.getItem("token");

    // Verificar se o token existe
    if (!token) {
      // Redirecionar para o login se não estiver autenticado
      router.push("/login");
    } else {
      // Atribuir a situação da autenticação
      setAuthenticated(true);
    }
  }, []);

  // Retornar a situação da autenticação
  return {
    authenticated,
  };
}
