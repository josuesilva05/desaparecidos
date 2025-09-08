import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

export function ImageModal({ selectedImage, onClose }: ImageModalProps) {
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

  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-5">
        <DialogHeader>
          <DialogTitle>Visualização da Imagem</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center h-full">
          <img
            src={selectedImage}
            alt="Visualização em tamanho grande"
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() =>
              downloadFile(
                selectedImage,
                `imagem_${Date.now()}_${getFileNameFromUrl(selectedImage)}`
              )
            }
            className="mr-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Imagem
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
