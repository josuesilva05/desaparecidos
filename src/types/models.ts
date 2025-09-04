export interface PessoasEstatistico {
    quantPessoasDesaparecidas: number;
    quantPessoasEncontradas: number;
}

export interface DetalhesPessoaDesaparecida {
    id: number;
    nome: string;
    idade: number;
    sexo: string;
    vivo: boolean;
    urlFoto: string;
    ultimaOcorrencia: {
        dtDesaparecimento: string;
        dataLocalizacao: string;
        encontradoVivo: boolean;
        localDesaparecimentoConcat: string;
        ocorrenciaEntrevDesapDTO: {
            informacao: string;
            vestimentaDesaparecido: string;
        }
    }
    listaCartaz: [
        {
            urlCartaz: string;
            tipoCartaz: string;
        }
    ]
    ocoId: number;
}