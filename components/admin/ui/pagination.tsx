import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  from: number;
  to: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  bordered?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  from,
  to,
  itemLabel,
  onPageChange,
  bordered = true,
  className,
}: PaginationProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        bordered && "border-t border-line px-5 py-4",
        className,
      )}
    >
      <p className="text-[12.5px] text-muted">
        Mostrando{" "}
        <strong className="font-semibold text-ink">{from}–{to}</strong> de{" "}
        <strong className="font-semibold text-ink">{totalItems}</strong>{" "}
        {itemLabel}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            className="page-btn page-nav"
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <IoChevronBackOutline aria-hidden="true" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={cn("page-btn", page === currentPage && "active")}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            <IoChevronForwardOutline aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}