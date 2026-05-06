// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importar o adptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from "@hookform/resolvers/yup";

// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

// Importar a dependência para validar o formulário.
import * as yup from "yup";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas
import { useParams } from "next/navigation";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente link do next
import Link from "next/link";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

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

export default function EditUser() {
  // Usado o useParams para acessar o parâmetro 'id' da URL
  const { id } = useParams();

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [sucess, setSucess] = useState<string | null>(null);

  // Estado para controle de situations
  const [situations, setSituations] = useState<Situation[]>([]);

  // Estado de uso para setar as situações dentro do select
  useEffect(() => {
    instance
      .get("/situations")
      .then((res) => setSituations(res.data.result.data));
  }, []);

  // Função para buscar os users da API
  const fetchUserDetails = async (id: string) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/users/${id}`);

      // Atualizar o estado com os dados da API
      reset(response.data);
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
        setError("Erro ao editar o usuário, Tente novamente.");
      }
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

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
    setSucess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.put(`/users/${id}`, data);

      // Exibir mensagem de sucesso
      setSucess(response.data.message || "Usuário editado com sucesso!");
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
        setError("Erro ao editar o usuário, Tente novamente.");
      }
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

  // Chamar a função fetchSituationDetails quando o componente é montado
  useEffect(() => {
    if (id) {
      // Garantir que o id seja uma string
      const userId = Array.isArray(id) ? id[0] : id;
      // Busca os dados do user se o id estiver disponível
      fetchUserDetails(userId);
    }
  }, [id]); // Recarrega os dados quando o id mudar

  return (
    <ProtectedRoute>
      <Menu />
      <br />
      <Link href={`/users/list`}>Listar</Link>
      <br />
      <h1>Cadastrar Usuário</h1>
      <br />
      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe mensagem de erro*/}
      {error && <p style={{ color: "#F00" }}>{error}</p>}
      {/* Exibe mensagem de sucesso */}
      {sucess && <p style={{ color: "#086" }}>{sucess}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Nome do Usuário: </label>
          <input
            type="text"
            id="name"
            placeholder="Nome do Usuário"
            {...register("name")}
            className="border"
          />
          {/* Exibe o erro de validação do campo */}
          {errors.name && (
            <p style={{ color: "#F00" }}>{errors.name.message}</p>
          )}

          <br />
          <br />

          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            placeholder="example@example.com"
            {...register("email")}
            className="border"
          />
          {/* Exibe o erro de validação do campo */}
          {errors.email && (
            <p style={{ color: "#F00" }}>{errors.email.message}</p>
          )}

          <br />
          <br />

          <label htmlFor="situation">Situação: </label>
          <select
            id="situation"
            {...register("situation", { valueAsNumber: true })}
            className="border"
          >
            <option value="">Selecione...</option>
            {situations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameSituation}
              </option>
            ))}
          </select>
          {/* Exibe o erro de validação do campo */}
          {errors.situation && (
            <p style={{ color: "#F00" }}>{errors.situation.message}</p>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Salvar"}{" "}
        </button>
      </form>
    </ProtectedRoute>
  );
}
