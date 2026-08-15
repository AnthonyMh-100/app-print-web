import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({ currentPage, totalPages, onPageChange }: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const prev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const next = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination" aria-label="Paginación">
      <button
        className="page-btn page-nav"
        type="button"
        onClick={prev}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <IoChevronBackOutline aria-hidden="true" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? "active" : ""}`}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="page-btn page-nav"
        type="button"
        onClick={next}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        <IoChevronForwardOutline aria-hidden="true" />
      </button>
    </div>
  );
}