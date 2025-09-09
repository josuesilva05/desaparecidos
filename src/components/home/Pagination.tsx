import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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
  loading = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <div className="text-sm text-muted-foreground">
          Mostrando{" "}
          <span className="font-medium">
            {Math.min(totalElements, pageSize)}
          </span>{" "}
          de <span className="font-medium">{totalElements}</span> resultados
        </div>
      </div>
    );
  }

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (range[0] > 0) {
      rangeWithDots.push(0);
      if (range[0] > 1) {
        rangeWithDots.push(-1);
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      if (range[range.length - 1] < totalPages - 2) {
        rangeWithDots.push(-1);
      }
      rangeWithDots.push(totalPages - 1);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-6">
      <div className="text-sm text-muted-foreground order-2 lg:order-1">
        Mostrando <span className="font-medium">{startItem}</span> a{" "}
        <span className="font-medium">{endItem}</span> de{" "}
        <span className="font-medium">{totalElements}</span> resultados
      </div>
      <div className="order-1 lg:order-2">
        <UIPagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 0 && !loading) {
                    onPageChange(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 0 || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
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
                      loading ? "pointer-events-none opacity-50" : ""
                    } ${
                      currentPage === pageIndex
                        ? "bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages - 1 && !loading) {
                    onPageChange(currentPage + 1);
                  }
                }}
                className={
                  currentPage === totalPages - 1 || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </UIPagination>
      </div>
    </div>
  );
}
