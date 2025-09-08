import { AlertCircle, ArrowDown, ArrowUp, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { OcorrenciaInformacaoDTO } from "@/types/models";

interface ReportedInformationProps {
  informacoes: OcorrenciaInformacaoDTO[];
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  onImageClick: (imageUrl: string) => void;
}

export function ReportedInformation({
  informacoes,
  sortOrder,
  onToggleSortOrder,
  onImageClick
}: ReportedInformationProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isImageUrl = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  return (
    <Card className="flex-1 flex flex-col limited-height-card bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Informações Reportadas</span>
            {informacoes.length > 0 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleSortOrder}
                  className="h-8 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
                  title={`Ordenar por data ${sortOrder === 'desc' ? 'crescente' : 'decrescente'}`}
                >
                  {sortOrder === 'desc' ? (
                    <>
                      <ArrowDown className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Recente</span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Antiga</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          {informacoes.length > 0 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
              {informacoes.length}{" "}
              {informacoes.length === 1 ? "registro" : "registros"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar min-h-0 card-content">
        {informacoes.length > 0 ? (
          <div className="p-4 space-y-4">
            {informacoes.map((info) => (
              <InformationItem
                key={info.id}
                info={info}
                onImageClick={onImageClick}
                formatDate={formatDate}
                isImageUrl={isImageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Nenhuma informação reportada
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Seja o primeiro a compartilhar uma informação
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface InformationItemProps {
  info: OcorrenciaInformacaoDTO;
  onImageClick: (imageUrl: string) => void;
  formatDate: (dateString?: string) => string;
  isImageUrl: (url: string) => boolean;
}

function InformationItem({ info, onImageClick, formatDate, isImageUrl }: InformationItemProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      {/* Cabeçalho da informação */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data: {formatDate(info.data)}
          </span>
        </div>
      </div>

      {/* Texto da informação */}
      <div className="mb-3">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-600">
          {info.informacao}
        </p>
      </div>

      {/* Anexos em quadradinhos */}
      {info.anexos && info.anexos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Anexos ({info.anexos.length})
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {info.anexos.map((anexo, anexoIndex) => (
              <AttachmentGridItem
                key={anexoIndex}
                anexo={anexo}
                anexoIndex={anexoIndex}
                info={info}
                onImageClick={onImageClick}
                formatDate={formatDate}
                isImageUrl={isImageUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AttachmentGridItemProps {
  anexo: string;
  anexoIndex: number;
  info: OcorrenciaInformacaoDTO;
  onImageClick: (imageUrl: string) => void;
  formatDate: (dateString?: string) => string;
  isImageUrl: (url: string) => boolean;
}

function AttachmentGridItem({
  anexo,
  anexoIndex,
  info,
  onImageClick,
  formatDate,
  isImageUrl
}: AttachmentGridItemProps) {
  return (
    <div className="group relative attachment-grid-item">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
        {isImageUrl(anexo) ? (
          <img
            src={anexo}
            alt={`Anexo ${anexoIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onImageClick(anexo)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.open(anexo, "_blank")}
          >
            <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      {/* Botões de ação - aparecem no hover */}
      <div className="absolute -bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 action-buttons">
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded shadow-lg p-1 border border-gray-200 dark:border-gray-600">
          <Dialog>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  Anexo - {formatDate(info.data)}
                </DialogTitle>
              </DialogHeader>
              <div className="flex justify-center">
                {isImageUrl(anexo) ? (
                  <img
                    src={anexo}
                    alt={`Anexo ${anexoIndex + 1}`}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Arquivo não é uma imagem
                    </p>
                    <Button
                      onClick={() => window.open(anexo, "_blank")}
                    >
                      Abrir arquivo
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
