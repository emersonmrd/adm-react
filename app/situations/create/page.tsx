// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado
import { useState } from "react";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

// Importa o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente link do next
import Link from "next/link";

export default function CreateSituation() {
  // Estado para o campo nameSituation
  const [nameSituation, setNameSituation] = useState<string>("");

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [sucess, setSucess] = useState<string | null>(null);

  // Função para enviar os dados para a API
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Evita o recarregamento da página ao enviar o formulário
    event.preventDefault();

    // Inicia o carregamento
    setLoading(true);

    // Limpar o erro anterior
    setError(null);

    // Limpa o sucesso anterior
    setSucess(null);

    try {
      // Fazer a requisição à API e enviar os dados
      const response = await instance.post("/situations", {
        nameSituation: nameSituation, // Envia o nome da situação
      });

      // Exibir mensagem de sucesso
      setSucess(response.data.message || "Situação cadastrada com sucesso!");

      // Limpa o campo do formulário
      setNameSituation("");
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
        setError("Erro ao cadastrar a situação, Tente novamente.");
      }
    } finally {
      //Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  return (
    <div>
      <Menu />
      <br />
      <Link href={`/situations/list`}>Listar</Link>
      <br />
      <h1>Cadastrar Situação</h1>
      <br />
      {/* Exibir o carregando */}
      {loading && <p>Carregando...</p>}
      {/* Exibe mensagem de erro*/}
      {error && <p style={{ color: "#F00" }}>{error}</p>}
      {/* Exibe mensagem de sucesso */}
      {sucess && <p style={{ color: "#086" }}>{sucess}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nameSituation">Nome da Situação</label>
          <input
            type="text"
            id="nameSituation"
            value={nameSituation}
            placeholder="Nome da situação"
            onChange={(e) => setNameSituation(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}{" "}
        </button>
      </form>
    </div>
  );
}
