import { Loader2, Search } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-20 h-20 text-primary animate-spin opacity-60" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Carregando...
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Preparando as informações para ajudar você a encontrar pessoas
            desaparecidas
          </p>
        </div>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center justify-center gap-1 text-muted-foreground">
          <span className="text-xs">ABITUS - Polícia Judiciária Civil</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
