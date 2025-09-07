import React, { useState } from 'react';
import { X, Camera, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adicionarInformacoes } from '@/services/apiService';

interface PersonInformationFormProps {
  personId: number;
  personName: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
  ocorrenciaId: number;
}

// Interface baseada exatamente no schema da API
interface InformationFormData {
  informacao: string;  // Informações sobre a visualização da pessoa (obrigatório)
  descricao: string;   // Descrição do anexo (obrigatório)
  data: string;        // Data da visualização (obrigatório)
  fotos: File[];       // Arquivos (opcional)
}

export function PersonInformationForm({ personName, onClose, onSubmit, ocorrenciaId }: PersonInformationFormProps) {
  const [formData, setFormData] = useState<InformationFormData>({
    informacao: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    fotos: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (field: keyof InformationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });
    
    setFormData(prev => ({
      ...prev,
      fotos: [...prev.fotos, ...validFiles].slice(0, 3) // Max 3 fotos
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas conforme schema da API
    if (!formData.informacao.trim()) {
      alert('Por favor, descreva onde a pessoa foi vista (campo obrigatório).');
      return;
    }
    
    if (!formData.descricao.trim()) {
      alert('Por favor, forneça uma descrição (campo obrigatório).');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Enviar para a API real
      await adicionarInformacoes(
        formData.informacao.trim(),
        formData.descricao.trim(),  
        formData.data,
        ocorrenciaId,
        formData.fotos.length > 0 ? formData.fotos : undefined
      );

      alert('Informação enviada com sucesso! Suas informações foram registradas e serão analisadas pelas autoridades competentes.');
      
      onSubmit(formData);
    } catch (error) {
      console.error('Erro ao enviar informação:', error);
      
      let errorMessage = 'Erro ao enviar informação. Tente novamente.';
      
      if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      setSubmitError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-xl">Fornecer Informação</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Sobre: <span className="font-medium">{personName}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Informação (obrigatório) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Informações sobre onde viu a pessoa *
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Ex: Foi vista em Cuiabá na rua ABC, número 123, utilizando saia rosa"
                value={formData.informacao}
                onChange={(e) => handleInputChange('informacao', e.target.value)}
                maxLength={500}
                required
              />
              <div className="text-xs text-gray-500">
                {formData.informacao.length}/500 caracteres
              </div>
            </div>

            {/* Campo Descrição (obrigatório) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descrição *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Foto da pessoa avistada, Relato de vizinho, etc."
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                maxLength={200}
                required
              />
              <div className="text-xs text-gray-500">
                {formData.descricao.length}/200 caracteres
              </div>
            </div>

            {/* Campo Data (obrigatório) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Data do avistamento *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Campo Arquivos (opcional) */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Fotos (opcional)
              </label>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={formData.fotos.length >= 3}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                      formData.fotos.length >= 3
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {formData.fotos.length >= 3 ? 'Máximo atingido' : 'Adicionar Foto'}
                  </label>
                </div>
                <div className="text-xs text-gray-500">
                  Máximo: 3 fotos, 5MB cada
                </div>
              </div>

              {/* Lista de arquivos selecionados */}
              {formData.fotos.length > 0 && (
                <div className="space-y-2">
                  {formData.fotos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center space-x-3">
                        <Camera className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({Math.round(file.size / 1024)}KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Erro de envio */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  {submitError}
                </p>
              </div>
            )}

            {/* Aviso de privacidade */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Suas informações serão compartilhadas com as autoridades competentes 
                para auxiliar nas investigações. Os dados pessoais serão tratados conforme a LGPD.
              </p>
            </div>

            {/* Botões */}
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
                {isSubmitting ? 'Enviando...' : 'Enviar Informação'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
