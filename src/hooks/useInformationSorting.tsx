import { useState, useCallback } from "react";
import type { OcorrenciaInformacaoDTO } from "@/types/models";

export function useInformationSorting() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortInformacoesByDate = useCallback((infos: OcorrenciaInformacaoDTO[], order: 'asc' | 'desc' = sortOrder) => {
    return infos.sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        console.warn("Data inválida encontrada:", { a: a.data, b: b.data });
        return 0;
      }
      
      return order === 'desc' 
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }, [sortOrder]);

  const toggleSortOrder = useCallback(() => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    return newOrder;
  }, [sortOrder]);

  const sortInfos = useCallback((infos: OcorrenciaInformacaoDTO[]) => {
    return sortInformacoesByDate([...infos]);
  }, [sortInformacoesByDate]);

  return {
    sortOrder,
    toggleSortOrder,
    sortInfos,
    sortInformacoesByDate
  };
}
