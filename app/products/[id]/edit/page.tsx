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

// Importa o componente link do next
import Link from "next/link";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

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

export default function EditProduct() {
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

  // Função para buscar os produtos da API
  const fetchProductDetails = async (id: string) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/products/${id}`);

      // Atualizar o estado com os dados da API
      // Como a API retorna objetos, mapeamos situation e category para receberem apenas os IDs
      reset({
        ...response.data,
        situation: response.data.situation?.id,
        category: response.data.category?.id,
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
          setError(error.response.data.message.join(" - "));
        } else {
          setError(error.response.data.message);
        }
      } else {
        // Criar a mensagem genérica de erro
        setError("Erro ao editar o produto, Tente novamente.");
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
    setSucess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.put(`/products/${id}`, payload);

      // Exibir mensagem de sucesso
      setSucess(response.data.message || "Produto editado com sucesso!");

      // Limpa o campo do formulário
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
        setError("Erro ao editar o Produto, Tente novamente.");
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
      fetchProductDetails(userId);
    }
  }, [id]); // Recarrega os dados quando o id mudar

  return (
    <ProtectedRoute>
      <Link href={`/products/list`}>Listar</Link>
      <br />
      <h1>Editar Produto</h1>
      <br />
      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe mensagem de erro*/}
      {error && <p style={{ color: "#F00" }}>{error}</p>}
      {/* Exibe mensagem de sucesso */}
      {sucess && <p style={{ color: "#086" }}>{sucess}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Nome do Produto: </label>
          <input
            type="text"
            id="name"
            placeholder="Nome do Produto"
            {...register("name")}
            className="border"
          />
          {/* Exibe o erro de validação do campo */}
          {errors.name && (
            <p style={{ color: "#F00" }}>{errors.name.message}</p>
          )}

          <br />
          <br />

          <label htmlFor="description">Descrição: </label>
          <input
            type="text"
            id="description"
            placeholder="Descrição do Produto..."
            {...register("description")}
            className="border"
          />
          {/* Exibe o erro de validação do campo */}
          {errors.description && (
            <p style={{ color: "#F00" }}>{errors.description.message}</p>
          )}

          <br />
          <br />

          <label htmlFor="price">Preço (R$): </label>
          <input
            type="text"
            id="price"
            placeholder="Ex: 497.40"
            step="0.01"
            inputMode="decimal"
            min="0"
            {...register("price", { valueAsNumber: true })}
            className="border"
          />
          {/* Exibe o erro de validação do campo */}
          {errors.price && (
            <p style={{ color: "#F00" }}>{errors.price.message}</p>
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
                {s.name}
              </option>
            ))}
          </select>
          {/* Exibe o erro de validação do campo */}
          {errors.situation && (
            <p style={{ color: "#F00" }}>{errors.situation.message}</p>
          )}

          <br />
          <br />

          <label htmlFor="category">Categoria: </label>
          <select
            id="category"
            {...register("category", { valueAsNumber: true })}
            className="border"
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {/* Exibe o erro de validação do campo */}
          {errors.category && (
            <p style={{ color: "#F00" }}>{errors.category.message}</p>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Salvar"}{" "}
        </button>
      </form>
    </ProtectedRoute>
  );
}
