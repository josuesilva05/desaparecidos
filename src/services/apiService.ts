import axios from 'axios';
import { environment } from '@/environments/environment';
import type { PessoasEstatistico } from '@/types/models';

export const getPessoasEstatistico = async (): Promise<PessoasEstatistico> => {
    const res = await axios.get(`${environment.apiUrl}/pessoas/aberto/estatistico`);
    return res.data;
}

export const teste = async (): Promise<void> => {
    console.log('teste');
}