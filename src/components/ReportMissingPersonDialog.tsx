import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AlertCircle, ArrowLeft, ArrowRight, CalendarIcon, FileText, MapPin, User, Users } from 'lucide-react';
import { adicionarOcorrenciaIntegracao } from '@/services/apiService';
import type { 
  OcorrenciaIntegracaoDto
} from '@/types/models';

interface ReportMissingPersonDialogProps {
  children: React.ReactNode;
}

type Step = 'victim' | 'reporter' | 'disappearance' | 'interview' | 'contacts' | 'review';

const STEPS: { key: Step; title: string; icon: React.ReactNode }[] = [
  { key: 'victim', title: 'Dados da Vítima', icon: <User className="w-4 h-4" /> },
  { key: 'reporter', title: 'Dados do Comunicante', icon: <Users className="w-4 h-4" /> },
  { key: 'disappearance', title: 'Detalhes do Desaparecimento', icon: <MapPin className="w-4 h-4" /> },
  { key: 'interview', title: 'Entrevista', icon: <FileText className="w-4 h-4" /> },
  { key: 'contacts', title: 'Contatos', icon: <Users className="w-4 h-4" /> },
  { key: 'review', title: 'Revisão', icon: <FileText className="w-4 h-4" /> },
];

export function ReportMissingPersonDialog({ children }: ReportMissingPersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('victim');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<Partial<OcorrenciaIntegracaoDto>>({
    usuarioCadastroId: 1, // This should come from auth context
    nomeUsuarioCadastro: 'Sistema Web',
    cargoUsuarioCadastro: 'COMUNICANTE',
    vitima: {
      nome: '',
      sexo: undefined,
      dtNascimento: '',
      mae: '',
      pai: '',
      cutis: undefined,
      escolaridade: undefined,
      estadoCivil: undefined,
      telefones: [],
      emails: [],
      enderecos: []
    },
    comunicante: {
      nome: '',
      telefones: [],
      emails: [],
      enderecos: []
    },
    entrevistaDesaparecimento: {
      ondeFoiVistoUltimaVez: '',
      vestimenta: '',
      oqueEstavaFazendo: '',
      comQuemEstava: '',
      informacao: '',
      incomumOuSuspeito: ''
    },
    entrevistaComportamental: {
      depressaoAnsiedadeOutrosProblemasMentais: false,
      comportamentoAutoDestrutivo: false,
      terminoRelacionamentoRecente: false,
      desentendimentoRecente: false
    },
    contatos: [],
    dataHoraFato: '',
    grauParentescoComunicante: undefined
  });

  const currentStepIndex = STEPS.findIndex(step => step.key === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1].key);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1].key);
    }
  };

  const handleInputChange = (field: string, value: any, section: 'vitima' | 'comunicante' | 'entrevistaDesaparecimento' | 'entrevistaComportamental' | 'root' = 'root') => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'victim':
        if (!formData.vitima?.nome?.trim()) {
          newErrors['vitima.nome'] = 'Nome da vítima é obrigatório';
        }
        if (!formData.vitima?.dtNascimento) {
          newErrors['vitima.dtNascimento'] = 'Data de nascimento é obrigatória';
        } else {
          // Validate date format (YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(formData.vitima.dtNascimento)) {
            newErrors['vitima.dtNascimento'] = 'Formato de data inválido';
          } else {
            // Check if birth date is reasonable (not in future, not too old)
            const birthDate = new Date(formData.vitima.dtNascimento + 'T00:00:00');
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
            
            if (birthDate > today) {
              newErrors['vitima.dtNascimento'] = 'Data de nascimento não pode ser no futuro';
            } else if (birthDate < minDate) {
              newErrors['vitima.dtNascimento'] = 'Data de nascimento muito antiga';
            }
          }
        }
        break;
      case 'reporter':
        if (!formData.comunicante?.nome?.trim()) {
          newErrors['comunicante.nome'] = 'Nome do comunicante é obrigatório';
        }
        break;
      case 'disappearance':
        if (!formData.dataHoraFato) {
          newErrors['dataHoraFato'] = 'Data do desaparecimento é obrigatória';
        } else {
          // Validate date format (YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(formData.dataHoraFato)) {
            newErrors['dataHoraFato'] = 'Formato de data inválido';
          } else {
            // Check if date is not in the future
            const selectedDate = new Date(formData.dataHoraFato + 'T00:00:00');
            const today = new Date();
            today.setHours(23, 59, 59, 999); // End of today
            if (selectedDate > today) {
              newErrors['dataHoraFato'] = 'Data do desaparecimento não pode ser no futuro';
            }
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      // Prepare the data for submission
      const submitData: OcorrenciaIntegracaoDto = {
        usuarioCadastroId: formData.usuarioCadastroId!,
        nomeUsuarioCadastro: formData.nomeUsuarioCadastro!,
        cargoUsuarioCadastro: formData.cargoUsuarioCadastro!,
        vitima: {
          nome: formData.vitima!.nome,
          sexo: formData.vitima!.sexo,
          dtNascimento: formData.vitima!.dtNascimento,
          mae: formData.vitima!.mae || '',
          pai: formData.vitima!.pai || '',
          cutis: formData.vitima!.cutis,
          telefones: formData.vitima!.telefones || [],
          emails: formData.vitima!.emails || [],
          enderecos: formData.vitima!.enderecos || []
        },
        comunicante: {
          nome: formData.comunicante!.nome,
          telefones: formData.comunicante!.telefones || [],
          emails: formData.comunicante!.emails || [],
          enderecos: formData.comunicante!.enderecos || []
        },
        entrevistaDesaparecimento: {
          ondeFoiVistoUltimaVez: formData.entrevistaDesaparecimento?.ondeFoiVistoUltimaVez || '',
          vestimenta: formData.entrevistaDesaparecimento?.vestimenta || '',
          oqueEstavaFazendo: formData.entrevistaDesaparecimento?.oqueEstavaFazendo || '',
          comQuemEstava: formData.entrevistaDesaparecimento?.comQuemEstava || '',
          informacao: formData.entrevistaDesaparecimento?.informacao || '',
          incomumOuSuspeito: formData.entrevistaDesaparecimento?.incomumOuSuspeito || ''
        },
        entrevistaComportamental: {
          depressaoAnsiedadeOutrosProblemasMentais: formData.entrevistaComportamental?.depressaoAnsiedadeOutrosProblemasMentais || false,
          comportamentoAutoDestrutivo: formData.entrevistaComportamental?.comportamentoAutoDestrutivo || false,
          terminoRelacionamentoRecente: formData.entrevistaComportamental?.terminoRelacionamentoRecente || false,
          desentendimentoRecente: formData.entrevistaComportamental?.desentendimentoRecente || false
        },
        contatos: formData.contatos || [],
        grauParentescoComunicante: formData.grauParentescoComunicante,
        // Convert date to ISO format with time
        dataHoraFato: formData.dataHoraFato ? `${formData.dataHoraFato}T00:00:00.000Z` : undefined
      };

      console.log('Submitting data:', submitData);
      await adicionarOcorrenciaIntegracao(submitData);
      alert('Ocorrência registrada com sucesso!');
      setOpen(false);
      // Reset form
      setFormData({
        usuarioCadastroId: 1,
        nomeUsuarioCadastro: 'Sistema Web',
        cargoUsuarioCadastro: 'COMUNICANTE',
        vitima: { 
          nome: '', 
          sexo: undefined,
          dtNascimento: '',
          mae: '',
          pai: '',
          cutis: undefined,
          telefones: [], 
          emails: [], 
          enderecos: [] 
        },
        comunicante: { 
          nome: '', 
          telefones: [], 
          emails: [], 
          enderecos: [] 
        },
        entrevistaDesaparecimento: {
          ondeFoiVistoUltimaVez: '',
          vestimenta: '',
          oqueEstavaFazendo: '',
          comQuemEstava: '',
          informacao: '',
          incomumOuSuspeito: ''
        },
        entrevistaComportamental: {
          depressaoAnsiedadeOutrosProblemasMentais: false,
          comportamentoAutoDestrutivo: false,
          terminoRelacionamentoRecente: false,
          desentendimentoRecente: false
        },
        contatos: [],
        dataHoraFato: '',
        grauParentescoComunicante: undefined
      });
      setCurrentStep('victim');
    } catch (error) {
      console.error('Erro ao registrar ocorrência:', error);
      if (error instanceof Error) {
        alert(`Erro ao registrar ocorrência: ${error.message}`);
      } else {
        alert('Erro ao registrar ocorrência. Tente novamente.');
      }
    }
    setLoading(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'victim':
        return (
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <Input
                  value={formData.vitima?.nome || ''}
                  onChange={(e) => handleInputChange('nome', e.target.value, 'vitima')}
                  placeholder="Nome completo da vítima"
                  className={`w-full h-12 px-3 text-base ${errors['vitima.nome'] ? 'border-red-500' : ''}`}
                />
                {errors['vitima.nome'] && <p className="text-red-500 text-sm mt-1">{errors['vitima.nome']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de nascimento *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full h-12 px-3 text-base justify-between font-normal ${errors['vitima.dtNascimento'] ? 'border-red-500' : ''}`}
                    >
                      {formData.vitima?.dtNascimento ? 
                        (() => {
                          const date = new Date(formData.vitima.dtNascimento + 'T00:00:00');
                          return date.toLocaleDateString('pt-BR');
                        })() :
                        "Selecionar data"
                      }
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.vitima?.dtNascimento ? new Date(formData.vitima.dtNascimento + 'T00:00:00') : undefined}
                      onSelect={(date) => {
                        if (date) {
                          // Format date as YYYY-MM-DD to avoid timezone issues
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          handleInputChange('dtNascimento', `${year}-${month}-${day}`, 'vitima');
                        }
                      }}
                      captionLayout="dropdown"
                      fromYear={1920}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors['vitima.dtNascimento'] && <p className="text-red-500 text-sm mt-1">{errors['vitima.dtNascimento']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo
                </label>
                <Select
                  value={formData.vitima?.sexo || ''}
                  onValueChange={(value) => handleInputChange('sexo', value || undefined, 'vitima')}
                >
                  <SelectTrigger className="w-full !h-12 px-3 text-base min-h-[48px]">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASCULINO">Masculino</SelectItem>
                    <SelectItem value="FEMININO">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor da pele
                </label>
                <Select
                  value={formData.vitima?.cutis || ''}
                  onValueChange={(value) => handleInputChange('cutis', value || undefined, 'vitima')}
                >
                  <SelectTrigger className="w-full !h-12 px-3 text-base min-h-[48px]">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRANCA">Branca</SelectItem>
                    <SelectItem value="PRETA">Preta</SelectItem>
                    <SelectItem value="PARDA">Parda</SelectItem>
                    <SelectItem value="AMARELA">Amarela</SelectItem>
                    <SelectItem value="INDIGENA">Indígena</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da mãe
                </label>
                <Input
                  value={formData.vitima?.mae || ''}
                  onChange={(e) => handleInputChange('mae', e.target.value, 'vitima')}
                  placeholder="Nome completo da mãe"
                  className="w-full h-12 px-3 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do pai
                </label>
                <Input
                  value={formData.vitima?.pai || ''}
                  onChange={(e) => handleInputChange('pai', e.target.value, 'vitima')}
                  placeholder="Nome completo do pai"
                  className="w-full h-12 px-3 text-base"
                />
              </div>
            </div>
          </div>
        );

      case 'reporter':
        return (
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <Input
                  value={formData.comunicante?.nome || ''}
                  onChange={(e) => handleInputChange('nome', e.target.value, 'comunicante')}
                  placeholder="Seu nome completo"
                  className={`w-full h-12 px-3 text-base ${errors['comunicante.nome'] ? 'border-red-500' : ''}`}
                />
                {errors['comunicante.nome'] && <p className="text-red-500 text-sm mt-1">{errors['comunicante.nome']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grau de parentesco
                </label>
                <Select
                  value={formData.grauParentescoComunicante || ''}
                  onValueChange={(value) => handleInputChange('grauParentescoComunicante', value || undefined)}
                >
                  <SelectTrigger className="w-full !h-12 px-3 text-base min-h-[48px]">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAI_MAE">Pai/Mãe</SelectItem>
                    <SelectItem value="FILHO_FILHA">Filho/Filha</SelectItem>
                    <SelectItem value="CONJUGE">Cônjuge</SelectItem>
                    <SelectItem value="IRMA_IRMAO">Irmão/Irmã</SelectItem>
                    <SelectItem value="TIO_TIA">Tio/Tia</SelectItem>
                    <SelectItem value="PRIMO_PRIMA">Primo/Prima</SelectItem>
                    <SelectItem value="AMIGO_AMIGA">Amigo/Amiga</SelectItem>
                    <SelectItem value="NENHUM">Nenhum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'disappearance':
        return (
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data do desaparecimento *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full h-12 px-3 text-base justify-between font-normal ${errors['dataHoraFato'] ? 'border-red-500' : ''}`}
                    >
                      {formData.dataHoraFato ? 
                        (() => {
                          const date = new Date(formData.dataHoraFato + 'T00:00:00');
                          return date.toLocaleDateString('pt-BR');
                        })() :
                        "Selecionar data"
                      }
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dataHoraFato ? new Date(formData.dataHoraFato + 'T00:00:00') : undefined}
                      onSelect={(date) => {
                        if (date) {
                          // Format date as YYYY-MM-DD to avoid timezone issues
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          handleInputChange('dataHoraFato', `${year}-${month}-${day}`);
                        }
                      }}
                      captionLayout="dropdown"
                      fromYear={2020}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors['dataHoraFato'] && <p className="text-red-500 text-sm mt-1">{errors['dataHoraFato']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Último local visto
                </label>
                <Input
                  value={formData.entrevistaDesaparecimento?.ondeFoiVistoUltimaVez || ''}
                  onChange={(e) => handleInputChange('ondeFoiVistoUltimaVez', e.target.value, 'entrevistaDesaparecimento')}
                  placeholder="Endereço ou localização"
                  className="w-full h-12 px-3 text-base"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vestimenta no momento do desaparecimento
                </label>
                <textarea
                  value={formData.entrevistaDesaparecimento?.vestimenta || ''}
                  onChange={(e) => handleInputChange('vestimenta', e.target.value, 'entrevistaDesaparecimento')}
                  placeholder="Descreva as roupas e acessórios"
                  className="w-full px-3 py-3 text-base border border-gray-300 rounded-md h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  O que estava fazendo
                </label>
                <textarea
                  value={formData.entrevistaDesaparecimento?.oqueEstavaFazendo || ''}
                  onChange={(e) => handleInputChange('oqueEstavaFazendo', e.target.value, 'entrevistaDesaparecimento')}
                  placeholder="Atividade no momento do desaparecimento"
                  className="w-full px-3 py-3 text-base border border-gray-300 rounded-md h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Com quem estava
                </label>
                <Input
                  value={formData.entrevistaDesaparecimento?.comQuemEstava || ''}
                  onChange={(e) => handleInputChange('comQuemEstava', e.target.value, 'entrevistaDesaparecimento')}
                  placeholder="Pessoas que estavam junto"
                  className="w-full h-12 px-3 text-base"
                />
              </div>
            </div>
          </div>
        );

      case 'interview':
        return (
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 gap-4 lg:gap-6 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informações adicionais sobre o desaparecimento
                </label>
                <textarea
                  value={formData.entrevistaDesaparecimento?.informacao || ''}
                  onChange={(e) => handleInputChange('informacao', e.target.value, 'entrevistaDesaparecimento')}
                  placeholder="Detalhes importantes sobre o desaparecimento"
                  className="w-full px-3 py-3 text-base border border-gray-300 rounded-md h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Algo incomum ou suspeito
                </label>
                <textarea
                  value={formData.entrevistaDesaparecimento?.incomumOuSuspeito || ''}
                  onChange={(e) => handleInputChange('incomumOuSuspeito', e.target.value, 'entrevistaDesaparecimento')}
                  placeholder="Situações estranhas observadas"
                  className="w-full px-3 py-3 text-base border border-gray-300 rounded-md h-24 resize-none"
                />
              </div>

              <div className="w-full">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Indicadores comportamentais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.entrevistaComportamental?.depressaoAnsiedadeOutrosProblemasMentais || false}
                        onChange={(e) => handleInputChange('depressaoAnsiedadeOutrosProblemasMentais', e.target.checked, 'entrevistaComportamental')}
                        className="mr-3 h-4 w-4 flex-shrink-0"
                      />
                      <span className="text-sm">Problemas mentais (depressão, ansiedade)</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.entrevistaComportamental?.comportamentoAutoDestrutivo || false}
                        onChange={(e) => handleInputChange('comportamentoAutoDestrutivo', e.target.checked, 'entrevistaComportamental')}
                        className="mr-3 h-4 w-4 flex-shrink-0"
                      />
                      <span className="text-sm">Comportamento autodestrutivo</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.entrevistaComportamental?.desentendimentoRecente || false}
                        onChange={(e) => handleInputChange('desentendimentoRecente', e.target.checked, 'entrevistaComportamental')}
                        className="mr-3 h-4 w-4 flex-shrink-0"
                      />
                      <span className="text-sm">Desentendimento recente</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.entrevistaComportamental?.terminoRelacionamentoRecente || false}
                        onChange={(e) => handleInputChange('terminoRelacionamentoRecente', e.target.checked, 'entrevistaComportamental')}
                        className="mr-3 h-4 w-4 flex-shrink-0"
                      />
                      <span className="text-sm">Término de relacionamento recente</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Adicione contatos que podem ter informações sobre a pessoa desaparecida.
            </div>
            {/* This would be a more complex component to manage contacts array */}
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Funcionalidade de contatos será implementada em versão futura</p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="text-yellow-400 w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Revisão dos dados
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Verifique todos os dados antes de enviar. Uma vez enviado, a ocorrência será registrada no sistema.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Dados da Vítima</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Nome:</strong> {formData.vitima?.nome}</p>
                  <p><strong>Data de nascimento:</strong> {formData.vitima?.dtNascimento}</p>
                  <p><strong>Sexo:</strong> {formData.vitima?.sexo}</p>
                  <p><strong>Mãe:</strong> {formData.vitima?.mae || 'Não informado'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Dados do Comunicante</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Nome:</strong> {formData.comunicante?.nome}</p>
                  <p><strong>Parentesco:</strong> {formData.grauParentescoComunicante || 'Não informado'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Desaparecimento</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Data/Hora:</strong> {formData.dataHoraFato}</p>
                  <p><strong>Último local:</strong> {formData.entrevistaDesaparecimento?.ondeFoiVistoUltimaVez || 'Não informado'}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="!max-w-6xl !w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Reportar Desaparecimento
          </DialogTitle>
          <DialogDescription>
            Preencha as informações sobre a pessoa desaparecida. Todas as informações são importantes para auxiliar na localização.
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                index <= currentStepIndex
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[500px] py-4 w-full overflow-hidden">
          <div className="w-full">
            {renderStepContent()}
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isFirstStep}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                {loading ? 'Enviando...' : 'Enviar Ocorrência'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
