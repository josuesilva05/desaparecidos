import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonInformationForm } from "@/components/person-details/PersonInformationForm";
import type { PessoaDTO } from "@/types/models";

interface PersonHeaderProps {
  person: PessoaDTO;
  isDesaparecido: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onNavigateBack: () => void;
  onInformationSubmit: () => void;
}

export function PersonHeader({
  person,
  isDesaparecido,
  dialogOpen,
  setDialogOpen,
  onNavigateBack,
  onInformationSubmit
}: PersonHeaderProps) {
  return (
    <div className="mb-6">
      <Button
        onClick={onNavigateBack}
        variant="ghost"
        className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {person.nome}
          </h1>
          <Badge
            variant={isDesaparecido ? "destructive" : "default"}
            className={`text-sm font-medium ${
              isDesaparecido
                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800"
                : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800"
            }`}
          >
            {isDesaparecido ? (
              <>
                <AlertCircle className="mr-1 h-4 w-4" />
                Desaparecido(a)
              </>
            ) : (
              <>
                <CheckCircle className="mr-1 h-4 w-4" />
                Localizado(a)
              </>
            )}
          </Badge>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
              <AlertCircle className="mr-2 h-4 w-4" />
              Fornecer Informação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-2xl">
            <div>
              <DialogHeader className="items-start text-left space-y-1 mb-4">
                <DialogTitle className="text-left">Fornecer Informação</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sobre: <span className="font-medium">{person.nome}</span>
                </p>
              </DialogHeader>
              <PersonInformationForm
                personId={person.id || 0}
                ocorrenciaId={person.ultimaOcorrencia?.ocoId || 0}
                onClose={() => setDialogOpen(false)}
                onSubmit={onInformationSubmit}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
