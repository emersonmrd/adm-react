// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado
import { useEffect, useState } from "react";

// Importa hooks usado para manipular a navegação do usuário, useSearchParams para obter os parâmetros da URL
import { useRouter, useSearchParams } from "next/navigation";

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
import LoadingSpinner from "@/app/components/LoadingSpinner";

// Importa o componente de alerta
import AlertMessage from "@/app/components/AlertMessage";

// Validar os dados utilizando o yup
const schema = yup.object().shape({
  password: yup
    .string()
    .required("O campo senha é obrigatório!")
    .min(6, "O campo senha deve ter no mínimo 6 caracteres!")
    .max(128, "A senha deve ter no máximo 128 caracteres!")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula!")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número!")
    .matches(
      /[^A-Za-z0-9]/,
      "A senha deve conter pelo menos um caractere especial!",
    ),
});

export default function UpdatePassword() {
  // Instacia o objeto router
  const router = useRouter();

  // Instacia o objeto para obter os parâmetros da URL
  const searchParams = useSearchParams();

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);

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
    password: string;
    recoverPassword?: string;
    email?: string;
  }) => {
    // Chave recuperar senha
    data.recoverPassword = searchParams.get("key") || "";
    // E-mail do usuário
    data.email = searchParams.get("email") || "";

    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSuccess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.put("/update-password", data);

      // Limpa o campo do formulário
      reset();

      // Salvar a mensagem no sessionStorage antes de redirecionar
      sessionStorage.setItem(
        "successMessage",
        response.data.message || "Senha atualizada com sucesso!",
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
        setError("Erro ao atualizar a senha!");
      }
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

  // Hook para verificar se o token existe
  useEffect(() => {
    // Inicia o carregamento
    setLoading(true);

    // Recuperar o email e key da URL
    const email = searchParams.get("email") || "";
    const recoverPassword = searchParams.get("key") || "";

    // Verificar se o token existe
    if (!email || !recoverPassword) {
      // Salvar a mensagem no sessionStorage antes de redirecionar
      sessionStorage.setItem(
        "errorMessage",
        "Dados inválidos para recuperar a senha!",
      );

      // Redireciona para página de login se não tiver email e key
      router.push("/login");
    }

    const validateKey = async () => {
      try {
        // Fazer a requisição à API
        await instance.post("/validate-recover-password", {
          email,
          recoverPassword,
        });
      } catch (error: any) {
        // Verifica se o erro contém mensagens de validação
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Exibe as mensagens de erro se for um array de mensagens
          if (Array.isArray(error.response.data.message)) {
            sessionStorage.setItem(
              "errorMessage",
              error.response.data.message.join(" - "),
            );
          } else {
            // Exibe as mensagens de erro se for uma única mensagem
            sessionStorage.setItem("errorMessage", error.response.data.message);
          }
        } else {
          // Salvar a mensagem no sessionStorage antes de redirecionar
          sessionStorage.setItem(
            "errorMessage",
            "Dados inválidos para recuperar a senha!",
          );
        }
        // Redireciona para página de login se não tiver email e key
        router.push("/login");
      } finally {
        //Termina o carregamento
        setLoading(false);
      }
    };
    // Chamar a função validar token
    validateKey();
  }, []);

  return (
    <div className="bg-login">
      <div className="card-login">
        <h1 className="title-login">Recuperar Senha</h1>

        {/* Exibir o carregando */}
        {loading && <LoadingSpinner />}
        {/* Exibe mensagem de erro*/}
        <AlertMessage type="error" message={error} />
        {/* Exibe mensagem de sucesso */}
        <AlertMessage type="success" message={success} />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="form-group-login">
            <label htmlFor="password" className="form-label-login">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Senha forte aqui..."
              {...register("password")}
              className="form-input-login"
            />
            {/* Exibe o erro de validação do campo */}
            {errors.password && (
              <AlertMessage
                type="error"
                message={errors.password.message ?? null}
              />
            )}
          </div>
          <div className="btn-group-login">
            <button type="submit" className="btn-primary-md" disabled={loading}>
              {loading ? "Enviando..." : "Atualizar"}
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
