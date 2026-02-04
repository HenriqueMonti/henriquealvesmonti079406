/**
 * Pagination Component
 * Controles para navegação entre páginas
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  const canGoBack = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoBack) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <button
        onClick={handlePrevious}
        disabled={!canGoBack || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        ← Anterior
      </button>

      <span className="text-gray-700 font-medium">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={!canGoNext || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Próxima →
      </button>
    </div>
  );
}
