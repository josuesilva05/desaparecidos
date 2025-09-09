import React, { useState } from "react";
import { X, Camera, AlertCircle, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAlert } from "@/hooks/useAlert";
import { adicionarInformacoes } from "@/services/apiService";

interface PersonInformationFormProps {
  personId: number;
  onClose: () => void;
  onSubmit: (data: any) => void;
  ocorrenciaId: number;
}

interface InformationFormData {
  informacao: string;
  descricao: string;
  data: string;
  fotos: File[];
}

export function PersonInformationForm({
  onClose,
  onSubmit,
  ocorrenciaId,
}: PersonInformationFormProps) {
  const { success, error: showError } = useAlert();
  const [formData, setFormData] = useState<InformationFormData>({
    informacao: "",
    descricao: "",
    data: new Date().toISOString().split("T")[0],
    fotos: [],
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleInputChange = (
    field: keyof InformationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    const newFiles = [...formData.fotos, ...validFiles].slice(0, 6);

    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      fotos: newFiles,
    }));

    setPreviewUrls(newUrls);
  };

  const removeFile = (index: number) => {
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    const newFiles = formData.fotos.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      fotos: newFiles,
    }));

    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.informacao.trim()) {
      showError(
        "Por favor, descreva onde a pessoa foi vista (campo obrigatório)."
      );
      return;
    }

    if (!formData.descricao.trim()) {
      showError("Por favor, forneça uma descrição (campo obrigatório).");
      return;
    }

    const dataToSubmit = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : formData.data;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await adicionarInformacoes(
        formData.informacao.trim(),
        formData.descricao.trim(),
        dataToSubmit,
        ocorrenciaId,
        formData.fotos.length > 0 ? formData.fotos : undefined
      );

      success("Informações enviadas com sucesso!");

      setTimeout(() => {
        onSubmit(formData);
      }, 1000);
    } catch (error) {
      console.error("Erro ao enviar informação:", error);

      let errorMessage =
        "Erro ao enviar informação. Tente novamente mais tarde.";

      if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
      }

      setSubmitError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="informacao">
          Informações sobre onde viu a pessoa *
        </Label>
        <Textarea
          id="informacao"
          rows={4}
          placeholder="Ex: Foi vista em Cuiabá na rua ABC, número 123, utilizando saia rosa"
          value={formData.informacao}
          onChange={(e) => handleInputChange("informacao", e.target.value)}
          maxLength={500}
          required
        />
        <div className="text-xs text-muted-foreground">
          {formData.informacao.length}/500 caracteres
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Input
          id="descricao"
          type="text"
          placeholder="Ex: Foto da pessoa avistada, Relato de vizinho, etc."
          value={formData.descricao}
          onChange={(e) => handleInputChange("descricao", e.target.value)}
          maxLength={200}
          required
        />
        <div className="text-xs text-muted-foreground">
          {formData.descricao.length}/200 caracteres
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="data">Data do avistamento *</Label>
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="data"
              className="w-full justify-between font-normal"
            >
              {selectedDate
                ? selectedDate.toLocaleDateString("pt-BR")
                : "Selecionar data"}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                setSelectedDate(date);
                setIsDateOpen(false);
              }}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Fotos (opcional)</Label>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={formData.fotos.length >= 6}
            />
            <Button
              type="button"
              variant="outline"
              asChild
              disabled={formData.fotos.length >= 6}
            >
              <label
                htmlFor="file-upload"
                className={`cursor-pointer inline-flex items-center ${
                  formData.fotos.length >= 6 ? "cursor-not-allowed" : ""
                }`}
              >
                <Camera className="mr-2 h-4 w-4" />
                {formData.fotos.length >= 6
                  ? "Máximo atingido"
                  : "Adicionar Foto"}
              </label>
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Máximo: 6 fotos, 5MB cada
          </div>
        </div>

        {formData.fotos.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {formData.fotos.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                  <img
                    src={previewUrls[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="h-2 w-2" />
                </Button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-md">
                  {Math.round(file.size / 1024)}KB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {submitError && (
        <div className="bg-destructive/15 border border-destructive/30 rounded-md p-4">
          <p className="text-sm text-destructive">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            {submitError}
          </p>
        </div>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Importante:</strong> Fornecer informações falsas podem levar a
          consequências legais.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Informação"}
        </Button>
      </div>
    </form>
  );
}
