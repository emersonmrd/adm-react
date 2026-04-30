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

// Esquema de validação com Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("E-mail inválido!")
    .required("O email é obrigatório!"),
  password: yup.string().required("A senha é obrigatória!"),
});

export default function LoginPage() {
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
  const onSubmit = async (data: { email: string; password: string }) => {
    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSucess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.post("/", data);

      // Exibir mensagem de sucesso
      //alert(response.data.message || "Login realizado com sucesso.");
      // console.log(response.data);

      // Salvar o token no localStorage
      localStorage.setItem("token", response.data.user.token);

      // Redireciona para o dashboard
      router.push("/dashboard");
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
          setError(error.response.data.message);
        }
      } else {
        // Criar a mensagem genérica de erro
        setError("Erro ao realizar login!");
      }
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <br />
      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe mensagem de erro*/}
      {error && <p style={{ color: "#F00" }}>{error}</p>}
      {/* Exibe mensagem de sucesso */}
      {sucess && <p style={{ color: "#086" }}>{sucess}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">E-mail: </label>
          <input
            type="text"
            id="email"
            placeholder="email@example.com"
            {...register("email")}
            className="border"
          />
          {/* Exibe o erro de validação do campo */}
          {errors.email && (
            <p style={{ color: "#F00" }}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Senha: </label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha..."
            {...register("password")}
            className="border"
          />
          {/* Exibe o erro de validação do campo */}
          {errors.password && (
            <p style={{ color: "#F00" }}>{errors.password.message}</p>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logando..." : "Login"}{" "}
        </button>
      </form>
    </div>
  );
}
