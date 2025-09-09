import { Phone, Eye, Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PessoaDTO } from "@/types/models";

interface PersonSidebarProps {
  person: PessoaDTO;
  onImageClick: (imageUrl: string) => void;
}

export function PersonSidebar({ person, onImageClick }: PersonSidebarProps) {
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileNameFromUrl = (url: string) => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.split("?")[0] || "arquivo";
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-[50rem]">
      {person.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO && (
        <Card className="flex-shrink-0 bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">
              Informações do Desaparecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
              .vestimentasDesaparecido && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Vestimentas
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {
                    person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                      .vestimentasDesaparecido
                  }
                </p>
              </div>
            )}

            {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao && (
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Informações Adicionais
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="!gap-3 flex-1 flex flex-col bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg">Informações de Emergência</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex-shrink-0 border border-red-200 dark:border-red-800/30">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Viu esta pessoa?
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Entre em contato imediatamente com as autoridades.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-800 dark:text-red-200" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  (65) 3901-4839 (1ª DP - CENTRO DE CUIABÁ)
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <PosterSection
              person={person}
              onImageClick={onImageClick}
              downloadFile={downloadFile}
              getFileNameFromUrl={getFileNameFromUrl}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PosterSectionProps {
  person: PessoaDTO;
  onImageClick: (imageUrl: string) => void;
  downloadFile: (url: string, filename: string) => void;
  getFileNameFromUrl: (url: string) => string;
}

function PosterSection({
  person,
  onImageClick,
  downloadFile,
  getFileNameFromUrl,
}: PosterSectionProps) {
  const hasPosters =
    person.ultimaOcorrencia?.listaCartaz &&
    person.ultimaOcorrencia.listaCartaz.length > 0;

  if (hasPosters) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {person.ultimaOcorrencia!.listaCartaz!.map((cartaz, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0c0d18]"
          >
            <div className="relative">
              {cartaz.urlCartaz && (
                <img
                  src={cartaz.urlCartaz}
                  alt={`Cartaz ${cartaz.tipoCartaz}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onImageClick(cartaz.urlCartaz!)}
                />
              )}
              <div className="absolute top-2 left-2">
                <Badge
                  variant="secondary"
                  className="bg-white/90 dark:bg-gray-900/90 text-xs text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                >
                  CARTAZ DE DESAPARECIMENTO
                </Badge>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>
                        Cartaz - {cartaz.tipoCartaz?.replace("_", " ")}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                      <img
                        src={cartaz.urlCartaz}
                        alt={`Cartaz ${cartaz.tipoCartaz}`}
                        className="max-w-full max-h-[70vh] object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() =>
                    downloadFile(
                      cartaz.urlCartaz!,
                      `cartaz_${index + 1}_${getFileNameFromUrl(
                        cartaz.urlCartaz!
                      )}`
                    )
                  }
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0c0d18]">
        <div className="relative">
          <div className="w-full h-100 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium text-center px-4">
              Cartaz não disponível para essa pessoa
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-center px-4">
              Nenhum cartaz foi gerado ainda
            </p>
          </div>
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="bg-white/90 dark:bg-gray-900/90 text-xs text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
            >
              CARTAZ DE DESAPARECIMENTO
            </Badge>
          </div>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              disabled
            >
              <Eye className="mr-1 h-3 w-3" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              disabled
            >
              <Download className="mr-1 h-3 w-3" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
