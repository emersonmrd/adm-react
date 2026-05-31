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
interface Situation {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

// Validar os dados utilizando o yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("O campo nome é obrigatório!")
    .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
    .max(255, "O campo nome deve ter no máximo 255 caracteres!"), // Limite opcional

  description: yup
    .string()
    .required("O campo descrição é obrigatório!")
    .min(10, "A descrição deve ter pelo menos 10 caracteres!"), // Ajuste conforme necessário

  price: yup
    .number()
    .typeError("O preço deve ser um número!")
    .required("O campo preço é obrigatório!")
    .positive("O preço deve ser um valor positivo!")
    .test(
      "is-decimal",
      "O preço deve ter no máximo duas casas decimais!",
      (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || ""),
    ),

  situation: yup
    .number()
    .typeError("A situação deve ser selecionada!")
    .required("O campo situação é obrigatório!")
    .integer("O campo situação deve ser um número inteiro!")
    .positive("O campo situação deve ser um valor positivo!"),

  category: yup
    .number()
    .typeError("A categoria deve ser selecionada!")
    .required("O campo categoria é obrigatório!")
    .integer("O campo categoria deve ser um número inteiro!")
    .positive("O campo categoria deve ser um valor positivo!"),
});

// Tipo derivado automaticamente do schema pelo yup
type FormData = yup.InferType<typeof schema>;

export default function CreateProduct() {
  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);

  // Estado para controle de situations
  const [situations, setSituations] = useState<Situation[]>([]);

  // Estado para controle de Categorias
  const [categories, setCategories] = useState<Category[]>([]);

  // Estado de uso para setar as situações e categorias dentro do select
  useEffect(() => {
    Promise.all([
      instance.get("/product-situations"),
      instance.get("/product-categories"),
    ])
      .then(([situationsRes, categoriesRes]) => {
        setSituations(situationsRes.data.result.data);
        setCategories(categoriesRes.data.result.data);
      })
      .catch((err) => {
        setError(`Erro ao buscar os dados, Error: ${err}`);
      });
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
  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      slug: data.description.toLowerCase().replace(/\s+/g, "-"),
    };

    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSuccess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.post("/products", payload);

      // Exibir mensagem de sucesso
      setSuccess(response.data.message || "Produto cadastrado com sucesso!");

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
        setError("Erro ao cadastrar o Produto, Tente novamente.");
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
            <h2 className="content-title">Produto</h2>
            <nav className="breadcrumb">
              <a href="/dashboard" className="breadcrumb-link">
                Dashboard
              </a>
              <span> / </span>
              <a href="/products/list" className="breadcrumb-link">
                Produtos
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
              <Link href="/products/list" className="btn-info aling-icon-btn">
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
                Produto:{" "}
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nome do Produto"
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
              <label htmlFor="description" className="form-label">
                Descrição:{" "}
              </label>
              <input
                type="text"
                id="description"
                placeholder="Descrição do Produto..."
                {...register("description")}
                className="form-input"
              />
              {/* Exibe o erro de validação do campo */}
              {errors.description && (
                <AlertMessage
                  type="error"
                  message={errors.description.message ?? null}
                />
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="form-label">
                Preço (R$):{" "}
              </label>
              <input
                type="text"
                id="price"
                placeholder="Ex: 497.40"
                step="0.01"
                inputMode="decimal"
                min="0"
                {...register("price", { valueAsNumber: true })}
                className="form-input"
              />
              {/* Exibe o erro de validação do campo */}
              {errors.price && (
                <AlertMessage
                  type="error"
                  message={errors.price.message ?? null}
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
                    {s.name}
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
            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Categoria:{" "}
              </label>
              <select
                id="category"
                {...register("category", { valueAsNumber: true })}
                className="form-select"
              >
                <option value="" className="form-option">
                  Selecione...
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {/* Exibe o erro de validação do campo */}
              {errors.category && (
                <AlertMessage
                  type="error"
                  message={errors.category.message ?? null}
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
