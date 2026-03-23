interface PaginationProps {
  currentPage: number; // Página atual
  lastPage: number; // Última página disponível
  onPageChange: (page: number) => void; // Função para mudar de página
}

// Componente de paginação
const Pagination = ({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <div>
      <span>
        Página {currentPage} de {lastPage}
      </span>
      {`  -  `}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      {` `}
      <button disabled>{currentPage}</button>
      {` `}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
