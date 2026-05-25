// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

const Navbar = () => {
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
        <button id="toggleSidebar" className="menu-button">
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
          <div className="relative">
            <button id="userDropdownButton" className="dropdown-button">
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
            <div id="dropdownContent" className="dropdown-content hidden">
              <a href="#" className="dropdown-item">
                Perfil
              </a>
              <a href="#" className="dropdown-item" onClick={handleLogout}>
                Sair
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
