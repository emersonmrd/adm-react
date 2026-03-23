// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado e os efetios colaterais
import { useEffect, useState } from "react";

// Importa a instância do axios configurada para fazer as requisições para a API
import instance from "@/services/api";

export default function TestConnection() {
  // Cria um estado para armazenar a maensagem que será exibida na tela
  // O valor inidical é "Carregando...", que será substituiído após a tentativa de conexão
  const [message, setMessage] = useState<string>("Carregando...");

  // useEffect é utilizado para executar um código assim que o componente for montado
  // Neste caso, ele chama a função para testar a conexão com a API
  useEffect(() => {
    // Função assíncrona para testar a conexão com a API
    const testConnection = async () => {
      try {
        // Tenta fazer uma requisição GET apra o endpoint "/test-connection"
        const response = await instance.get("/test-connection");
        // Se a requisição for bem-sucedida, atualiza a mensagem com a resposta da API
        setMessage(response.data.message || "Conexão realizada com sucesso2!");
      } catch (error: any) {
        // Caso ocorra um erro na requisição, exibe o erro no console e define uma mensagem de erro
        console.error("Erro ao testar a conexão: ", error);
        setMessage(`Erro ao conectar com a API: ${error}`);
      }
    };

    //Chama a função para testar a conexão assim que o componente for montado
    testConnection();
  }, []); // A dependência vazia [] faz com que o useEffect execute apenas uma vez, após o componente ser montado

  return (
    <div>
      {/* Exibir a mensagem de status da conexão  */}
      {message}
      <br />
    </div>
  );
}
