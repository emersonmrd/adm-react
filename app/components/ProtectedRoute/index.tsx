// ReactNode permite que o children seja qualquer coisa renderizável em JSX.
import { ReactNode } from "react";

// Importa o hook responsável por validar o token
import useAuth from "@/app/hooks/useAuth";

// Cria a interface para tipar o parâmetro "children" do componente
interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Acessar a propriedade authenticated
  const { authenticated } = useAuth();

  // Verificar se está autenticado
  if (!authenticated) {
    // Mostrar algo enquanto redireciona
    return <p>Carregando...</p>;
  }

  // Retorna o conteúdo protegido caso o usuário esteja autenticado
  return <>{children}</>;
}
