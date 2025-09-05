import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalElements, 
  pageSize, 
  onPageChange, 
  loading = false 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage * pageSize) + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(0, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (range[0] > 1) {
      rangeWithDots.push(0);
      if (range[0] > 2) {
        rangeWithDots.push(-1); // Representa "..."
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 2) {
      if (range[range.length - 1] < totalPages - 3) {
        rangeWithDots.push(-1); // Representa "..."
      }
      rangeWithDots.push(totalPages - 1);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
      {/* Informações dos resultados */}
      <div className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{totalElements}</span> resultados
      </div>

      {/* Controles de paginação */}
      <div className="flex items-center space-x-1">
        {/* Primeira página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0 || loading}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Página anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Números das páginas */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((pageIndex, index) => {
            if (pageIndex === -1) {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={pageIndex}
                variant={currentPage === pageIndex ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageIndex)}
                disabled={loading}
                className={`h-8 w-8 p-0 ${
                  currentPage === pageIndex
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {pageIndex + 1}
              </Button>
            );
          })}
        </div>

        {/* Próxima página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || loading}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
