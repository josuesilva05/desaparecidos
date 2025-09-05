import { useState } from 'react';
import { X, MapPin, Camera, Calendar, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PersonInformationFormProps {
  personId: number;
  personName: string;
  onClose: () => void;
  onSubmit: (data: InformationFormData) => void;
}

export interface InformationFormData {
  informacao: string;
  data: string;
  localizacao: string;
  telefone: string;
  nomeContato: string;
  fotos: File[];
}

export function PersonInformationForm({ personId, personName, onClose, onSubmit }: PersonInformationFormProps) {
  const [formData, setFormData] = useState<InformationFormData>({
    informacao: '',
    data: new Date().toISOString().split('T')[0],
    localizacao: '',
    telefone: '',
    nomeContato: '',
    fotos: []
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 3)); // Max 3 fotos
    setFormData(prev => ({
      ...prev,
      fotos: [...prev.fotos, ...validFiles].slice(0, 3)
    }));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('telefone', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.informacao.trim()) {
      alert('Por favor, forneça as informações sobre o avistamento.');
      return;
    }

    if (!formData.nomeContato.trim()) {
      alert('Por favor, informe seu nome para contato.');
      return;
    }

    if (!formData.telefone.trim()) {
      alert('Por favor, informe um telefone para contato.');
      return;
    }

    // Mock: Em um sistema real, aqui seria feita a chamada à API
    console.log('Enviando informação (MOCK):', {
      personId,
      ...formData,
      timestamp: new Date().toISOString()
    });

    // Simula envio bem-sucedido
    alert('Informação enviada com sucesso! Obrigado por ajudar.');
    onSubmit(formData);
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
            {/* Informações do avistamento */}
            <div>
              <label htmlFor="informacao" className="block text-sm font-medium text-gray-700 mb-2">
                Informações sobre o avistamento *
              </label>
              <textarea
                id="informacao"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva onde e quando viu esta pessoa, o que ela estava fazendo, com quem estava, etc."
                value={formData.informacao}
                onChange={(e) => handleInputChange('informacao', e.target.value)}
                required
              />
            </div>

            {/* Data do avistamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Data do avistamento *
                </label>
                <input
                  type="date"
                  id="data"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Local do avistamento
                </label>
                <input
                  type="text"
                  id="localizacao"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Shopping Center Norte, São Paulo"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                />
              </div>
            </div>

            {/* Dados de contato */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Seus dados para contato
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nomeContato" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    id="nomeContato"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Como podemos te chamar?"
                    value={formData.nomeContato}
                    onChange={(e) => handleInputChange('nomeContato', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Telefone para contato *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Upload de fotos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Camera className="inline h-4 w-4 mr-1" />
                Fotos do avistamento (opcional)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Você pode anexar até 3 fotos. Máximo 5MB cada.
              </p>
              
              {selectedFiles.length < 3 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="foto-upload"
                  />
                  <label htmlFor="foto-upload" className="cursor-pointer">
                    <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Clique para selecionar fotos
                    </p>
                  </label>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enviar Informação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
