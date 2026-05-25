// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado
import { useState } from "react";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

// Importar o adptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from "@hookform/resolvers/yup";

// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

// Importar a dependência para validar o formulário.
import * as yup from "yup";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente link do next
import Link from "next/link";

// Importa o componente de loading
import LoadingSpinner from "../components/LoadingSpinner";

// Esquema de validação com Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("E-mail inválido!")
    .required("O email é obrigatório!"),
});

export default function RecoverPassword() {
  // Instacia o objeto router
  const router = useRouter();

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [sucess, setSucess] = useState<string | null>(null);

  // Iniciar o formulário com validações
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Função para enviar os dados para a API
  const onSubmit = async (data: {
    email: string;
    urlRecoverPassword?: string;
  }) => {
    // Atribuir a URL da aplicação
    data.urlRecoverPassword =
      "http://localhost:3000/recover-password/update-password";

    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSucess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.post("/recover-password", data);

      // Limpa o campo do formulário
      reset();

      // Salvar a mensagem no sessionStorage antes de redirecionar
      sessionStorage.setItem(
        "sucessMessage",
        response.data.message ||
          "E-mail enviado! Verifique sua caixa de entrada!",
      );

      // Redireciona para página de login
      router.push("/login");
    } catch (error: any) {
      // Verifica se o erro contém mensagens de validação
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Exibe as mensagens de erro se for um array de mensagens
        if (Array.isArray(error.response.data.message)) {
          setError(error.response.data.message.join(" - "));
        } else {
          // Exibe as mensagens de erro se for uma única mensagem
          setError(error.response.data.message);
        }
      } else {
        // Criar a mensagem genérica de erro
        setError("Erro ao recuperar a senha!");
      }
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

  return (
    <div className="bg-login">
      <div className="card-login">
        <h1 className="title-login">Recuperar Senha</h1>

        {/* Exibir o carregando */}
        {loading && <LoadingSpinner />}

        {/* Exibe mensagem de erro*/}
        {error && <p className="alert-danger">{error}</p>}
        {/* Exibe mensagem de sucesso */}
        {sucess && <p className="alert-success">{sucess}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="form-group-login">
            <label htmlFor="email" className="form-label-login">
              E-mail:
            </label>
            <input
              type="text"
              id="email"
              placeholder="email@example.com"
              {...register("email")}
              className="form-input-login"
            />
            {/* Exibe o erro de validação do campo */}
            {errors.email && (
              <p className="alert-danger">{errors.email.message}</p>
            )}
          </div>
          <div className="btn-group-login">
            <button type="submit" className="btn-primary-md" disabled={loading}>
              {loading ? "Enviando..." : "Recuperar"} {"  "}
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/login" className="link-login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
