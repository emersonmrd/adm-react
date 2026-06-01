// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado "useState", os efeitos colaterais "useEffect" e useRef para criar uma referência ao elemento.
import { useEffect, useRef, useState } from "react";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

const Navbar = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
}) => {
  // Estado para controlar se o dropdown está aberto ou fechado. Começa com "false" (fechado)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Criar uma referência para armazenar o elemento do dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // useEffect é executado quando o componente é montado e desmontado
  useEffect(() => {
    // Função para detectar cliques fora do dropdown
    function handleClickOutside(event: MouseEvent) {
      // Verifica se o dropdownRef tem um valor e se o clique Não foi dentro do dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Fecha o dropdown se o clique foi fora dele
        setDropdownOpen(false);
      }
    }

    // Adiciona um ouvinte de evento para detectar cliques no documento inteiro
    document.addEventListener("mousedown", handleClickOutside);

    // Fução de limpeza: remove o evento ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // O array vazio indica que o  efeito só roda na montagem e desmontagem do componente

  // Insatancia o objeto router
  const router = useRouter();

  const handleLogout = () => {
    // Remover o token do localStorage
    localStorage.removeItem("token");

    // Redirecionar para o login se não estiver autenticado
    router.push("/login");
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button
          id="toggleSidebar"
          className="menu-button"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg
            className="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="user-container">
          <div ref={dropdownRef}>
            <button
              id="userDropdownButton"
              className="dropdown-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Usuário
              <svg
                className="dropdown-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div id="dropdownContent" className="dropdown-content">
                <a href="#" className="dropdown-item">
                  Perfil
                </a>
                <a href="#" className="dropdown-item" onClick={handleLogout}>
                  Sair
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
