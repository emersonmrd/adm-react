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

// Interceptador para adicionar o token automaticamente nas requisições
instance.interceptors.request.use(
  (config) => {
    // Verifica se está no cliente antes de acessar o localStorage
    if (typeof window !== "undefined") {
      // Recuperar o token
      const token = localStorage.getItem("token");

      // Verificar se existe o token
      if (token) {
        // Acrecentar o token no Authorization
        config.headers.Authorization = `Bearer ${token}`;
        //console.log(`Bearer ${token}`);
      }
    }
    // Retorna as configuraçãoes
    return config;
  },
  (error) => {
    // Retornar erro
    return Promise.reject(error);
  },
);

// Exportar a instância do Axios para ser utilizada em outras partes do projeto
export default instance;
