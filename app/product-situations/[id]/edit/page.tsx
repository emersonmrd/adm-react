// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas
import { useParams } from "next/navigation";

// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
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

// Esquema de validação com Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("O nome da situação é obrigatório!")
    .min(3, "O nome deve ter pelo menos 3 caracteres!"),
});

export default function EditProductSituation() {
  // Usado o useParams para acessar o parâmetro 'id' da URL
  const { id } = useParams();

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);

  // Função para recuperar os dados da situação do produto a ser editada
  const fetchProductSituationDetails = async () => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/product-situations/${id}`);

      // Preenche o campo com os dados existentes
      reset({ name: response.data.name });
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
        setError("Erro ao editar a situação do produto, Tente novamente.");
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

  // Função para enviar os dados atualizados para a API
  const onSubmit = async (data: { name: string }) => {
    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSuccess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.put(`/product-situations/${id}`, data);

      // Exibir mensagem de sucesso
      setSuccess(
        response.data.message || "Situação do Produto editada com sucesso!",
      );
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
        setError("Erro ao editar a situação do produto, Tente novamente.");
      }
    } finally {
      //Termina o carregamento
      setLoading(false);
    }
  };

  // Chamar a função fetchProductSituationDetails quando o componente é montado
  useEffect(() => {
    if (id) {
      // Busca os dados da situação se o id estiver disponível
      fetchProductSituationDetails();
    }
  }, [id]); // Recarrega os dados quando o id mudar
  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Situação Produto</h2>
            <nav className="breadcrumb">
              <a href="/dashboard" className="breadcrumb-link">
                Dashboard
              </a>
              <span> / </span>
              <a href="/product-situations/list" className="breadcrumb-link">
                Situações Produtos
              </a>
              <span> / </span>
              <span>Editar</span>
            </nav>
          </div>
        </div>

        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Editar</h3>
            <div className="content-box-btn"></div>
          </div>
          <div className="content-box-body">
            {/* Exibir o carregando */}
            {loading && <LoadingSpinner />}

            {/* Exibe mensagem de erro*/}
            <AlertMessage type="error" message={error} />
            {/* Exibe mensagem de sucesso */}
            <AlertMessage type="success" message={success} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name">Situação do Produto: </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Nome da situação do Produto"
                  {...register("name")}
                  className="border"
                />
                {/* Exibe o erro de validação do campo */}
                {errors.name && (
                  <AlertMessage
                    type="error"
                    message={errors.name.message ?? null}
                  />
                )}
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Salvar"}{" "}
              </button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
