import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
            <AlertCircle className="w-12 h-12 text-orange-500 dark:text-orange-400" />
          </div>
          
          <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Ops! A página que você está procurando não existe ou foi removida.
            <br />
            Que tal voltar para a página inicial e continuar ajudando a encontrar pessoas desaparecidas?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            Ir para a página inicial
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            <Search className="w-4 h-4" />
            Voltar à página anterior
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda? Entre em contato conosco ou navegue pelos recursos disponíveis.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
