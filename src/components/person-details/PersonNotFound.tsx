import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonNotFoundProps {
  onNavigateBack: () => void;
}

export function PersonNotFound({ onNavigateBack }: PersonNotFoundProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Pessoa não encontrada
        </h2>
        <Button onClick={onNavigateBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para início
        </Button>
      </div>
    </div>
  );
}
