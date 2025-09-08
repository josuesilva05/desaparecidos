import { 
  Pagination as UIPagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationEllipsis 
} from '@/components/ui/pagination';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
  if (totalPages <= 1) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        {/* Informações dos resultados à esquerda */}
        <div className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium">{Math.min(totalElements, pageSize)}</span> de{' '}
          <span className="font-medium">{totalElements}</span> resultados
        </div>

        {/* Theme toggle à direita */}
        <ThemeToggle />
      </div>
    );
  }

  const startItem = (currentPage * pageSize) + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getVisiblePages = () => {
    const delta = 2; // Número de páginas para mostrar de cada lado da atual
    const range = [];
    const rangeWithDots = [];

    // Cria o range de páginas ao redor da página atual
    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Adiciona primeira página se não estiver no range
    if (range[0] > 0) {
      rangeWithDots.push(0);
      // Adiciona ellipsis se houver gap
      if (range[0] > 1) {
        rangeWithDots.push(-1); // Representa "..."
      }
    }

    // Adiciona o range principal
    rangeWithDots.push(...range);

    // Adiciona última página se não estiver no range
    if (range[range.length - 1] < totalPages - 1) {
      // Adiciona ellipsis se houver gap
      if (range[range.length - 1] < totalPages - 2) {
        rangeWithDots.push(-1); // Representa "..."
      }
      rangeWithDots.push(totalPages - 1);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-6">
      {/* Informações dos resultados à esquerda */}
      <div className="text-sm text-muted-foreground order-2 lg:order-1">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{totalElements}</span> resultados
      </div>

      {/* Controles de paginação centralizados */}
      <div className="order-1 lg:order-2">
        <UIPagination>
          <PaginationContent>
            {/* Página anterior */}
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 0 && !loading) {
                    onPageChange(currentPage - 1);
                  }
                }}
                className={currentPage === 0 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {/* Números das páginas */}
            {visiblePages.map((pageIndex, index) => {
              if (pageIndex === -1) {
                return (
                  <PaginationItem key={`dots-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!loading) {
                        onPageChange(pageIndex);
                      }
                    }}
                    isActive={currentPage === pageIndex}
                    className={`cursor-pointer transition-colors ${
                      loading ? 'pointer-events-none opacity-50' : ''
                    } ${
                      currentPage === pageIndex 
                        ? 'bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Próxima página */}
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages - 1 && !loading) {
                    onPageChange(currentPage + 1);
                  }
                }}
                className={currentPage === totalPages - 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </UIPagination>
      </div>


    </div>
  );
}
