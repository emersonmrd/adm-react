// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado
import { useState, useEffect } from "react";

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

// Importa o componente de layout
import Layout from "@/app/components/Layout";

// Importa o componente LoadingSpinner
import LoadingSpinner from "@/app/components/LoadingSpinner";

// Importa o componente de alerta
import AlertMessage from "@/app/components/AlertMessage";

// Definir tipos para a respota da API
interface User {
  name: string;
  email: string;
  password: string;
  situation: number;
}

interface Situation {
  id: number;
  nameSituation: string;
}

// Validar os dados utilizando o yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("O campo nome é obrigatório!")
    .min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
  email: yup
    .string()
    .email("E-mail inválido!")
    .required("O campo e-mail é obrigatório!"),
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
  situation: yup
    .number()
    .typeError("O campo situação é obrigatório!")
    .required("O campo situação é obrigatório!"),
});

export default function CreateUser() {
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);

  // Estado para controle de situations
  const [situations, setSituations] = useState<Situation[]>([]);

  // Estado de uso para setar as situações dentro do select
  useEffect(() => {
    instance
      .get("/situations")
      .then((res) => setSituations(res.data.result.data));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Função para enviar os dados para a API
  const onSubmit = async (data: User) => {
    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSuccess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.post("/users", data);

      // Exibir mensagem de sucesso
      setSuccess(response.data.message || "Usuário cadastrado com sucesso!");

      // Limpa o campo do formulário
      reset();
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
        setError("Erro ao cadastrar o usuário, Tente novamente.");
      }
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

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
              <a href="/users/list" className="breadcrumb-link">
                Usuários
              </a>
              <span> / </span>
              <span>Cadastrar</span>
            </nav>
          </div>
        </div>

        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Cadastrar</h3>
            <div className="content-box-btn">
              <Link href="/users/list" className="btn-info aling-icon-btn">
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
                    d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99"
                  />
                </svg>
                <span>Listar</span>
              </Link>
            </div>
          </div>
          {/* Exibir o carregando */}
          {loading && <LoadingSpinner />}

          {/* Exibe mensagem de erro*/}
          <AlertMessage type="error" message={error} />
          {/* Exibe mensagem de sucesso */}
          <AlertMessage type="success" message={success} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Nome:{" "}
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nome do Usuário"
                {...register("name")}
                className="form-input"
              />
              {/* Exibe o erro de validação do campo */}
              {errors.name && (
                <AlertMessage
                  type="error"
                  message={errors.name.message ?? null}
                />
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email:{" "}
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@example.com"
                {...register("email")}
                className="form-input"
              />
              {/* Exibe o erro de validação do campo */}
              {errors.email && (
                <AlertMessage
                  type="error"
                  message={errors.email.message ?? null}
                />
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Senha:{" "}
              </label>
              <input
                type="password"
                id="password"
                placeholder="Senha forte aqui..."
                {...register("password")}
                className="form-input"
              />
              {/* Exibe o erro de validação do campo */}
              {errors.password && (
                <AlertMessage
                  type="error"
                  message={errors.password.message ?? null}
                />
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="situation" className="form-label">
                Situação:{" "}
              </label>
              <select
                id="situation"
                {...register("situation", { valueAsNumber: true })}
                className="form-select"
              >
                <option value="" className="form-option">
                  Selecione...
                </option>
                {situations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameSituation}
                  </option>
                ))}
              </select>
              {/* Exibe o erro de validação do campo */}
              {errors.situation && (
                <AlertMessage
                  type="error"
                  message={errors.situation.message ?? null}
                />
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-success">
              {loading ? "Cadastrando..." : "Cadastrar"}{" "}
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
}
