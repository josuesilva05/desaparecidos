import { useState, useEffect } from "react";
import { detalhaPessoaDesaparecida, buscarInformacoes } from "@/services/apiService";
import type { PessoaDTO, OcorrenciaInformacaoDTO } from "@/types/models";

interface UsePersonDetailsProps {
  personId: string | undefined;
  sortInformacoesByDate: (infos: OcorrenciaInformacaoDTO[]) => OcorrenciaInformacaoDTO[];
}

export function usePersonDetails({ personId, sortInformacoesByDate }: UsePersonDetailsProps) {
  const [person, setPerson] = useState<PessoaDTO | null>(null);
  const [informacoes, setInformacoes] = useState<OcorrenciaInformacaoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonDetails = async () => {
    if (!personId) return;

    try {
      setLoading(true);
      const personData = await detalhaPessoaDesaparecida(parseInt(personId));
      setPerson(personData);

      if (personData.ultimaOcorrencia?.ocoId) {
        const infos = await buscarInformacoes(personData.ultimaOcorrencia.ocoId);
        const sortedInfos = sortInformacoesByDate(infos);
        setInformacoes(sortedInfos);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da pessoa:", error);
    } finally {
      setLoading(false);
    }
  };

  const refetchInformations = async () => {
    if (!person?.ultimaOcorrencia?.ocoId) return;
    
    try {
      const infos = await buscarInformacoes(person.ultimaOcorrencia.ocoId);
      const sortedInfos = sortInformacoesByDate(infos);
      setInformacoes(sortedInfos);
    } catch (error) {
      console.error("Erro ao recarregar informações:", error);
    }
  };

  useEffect(() => {
    fetchPersonDetails();
  }, [personId, sortInformacoesByDate]);

  return {
    person,
    informacoes,
    loading,
    setInformacoes,
    refetchInformations
  };
}
