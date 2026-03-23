// Importar o Axios e o tipo AxiosInstance para tipagem da instância
import axios, { AxiosInstance } from "axios";

// Definir o tipo para a instância do Axios
// Criar uma instância personalizada do Axios com configuração padrão
const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Definir a URL base para todas as requisições
  headers: {
    "Content-Type": "application/json", // Definir o cabeçalho padrão para envio de dados no formato JSON
  },
});

// Exportar a instância do Axios para ser utilizada em outras partes do projeto
export default instance;
