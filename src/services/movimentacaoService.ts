import { api } from './api';

export interface MovimentacaoEstoque {
  id: number;
  estoqueId: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  motivo: string;
  observacao?: string;
  responsavelId: number;
  dataMovimentacao: string;
  estoque: {
    id: number;
    produto: string;
    quantidade: number;
    unidade: string;
    localizacao?: string;
  };
  responsavel: {
    id: number;
    matricula: string;
  };
}

export interface RegistrarEntradaPayload {
  estoqueId: number;
  quantidade: number;
  motivo: string;
  observacao?: string;
}

export interface RegistrarSaidaPayload {
  estoqueId: number;
  quantidade: number;
  motivo: string;
  observacao?: string;
}

export interface ListarMovimentacoesParams {
  estoqueId?: number;
  tipo?: 'ENTRADA' | 'SAIDA';
  dataInicio?: string;
  dataFim?: string;
}

export interface ListarMovimentacoesResponse {
  success: boolean;
  movimentacoes: MovimentacaoEstoque[];
}

export interface RegistrarMovimentacaoResponse {
  success: boolean;
  message: string;
  movimentacao: MovimentacaoEstoque;
}

export interface BuscarMovimentacaoResponse {
  success: boolean;
  movimentacao: MovimentacaoEstoque;
}

export interface RelatorioEstoqueResponse {
  success: boolean;
  relatorio: {
    totalItens: number;
    itensComEstoque: number;
    itensSemEstoque: number;
    estoque: Array<{
      id: number;
      produto: string;
      quantidade: number;
      unidade: string;
      localizacao?: string;
      movimentacoes: MovimentacaoEstoque[];
    }>;
  };
}

export const movimentacaoService = {
  // Registrar entrada de produtos
  async registrarEntrada(payload: RegistrarEntradaPayload): Promise<RegistrarMovimentacaoResponse> {
    const response = await api.post<RegistrarMovimentacaoResponse>('/movimentacao/entrada', payload);
    return response.data;
  },

  // Registrar saída de produtos
  async registrarSaida(payload: RegistrarSaidaPayload): Promise<RegistrarMovimentacaoResponse> {
    const response = await api.post<RegistrarMovimentacaoResponse>('/movimentacao/saida', payload);
    return response.data;
  },

  // Listar todas as movimentações com filtros
  async listarMovimentacoes(params?: ListarMovimentacoesParams): Promise<ListarMovimentacoesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.estoqueId) queryParams.append('estoqueId', params.estoqueId.toString());
    if (params?.tipo) queryParams.append('tipo', params.tipo);
    if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params?.dataFim) queryParams.append('dataFim', params.dataFim);

    const response = await api.get<ListarMovimentacoesResponse>(`/movimentacao?${queryParams.toString()}`);
    return response.data;
  },

  // Buscar movimentação específica
  async buscarMovimentacao(id: number): Promise<BuscarMovimentacaoResponse> {
    const response = await api.get<BuscarMovimentacaoResponse>(`/movimentacao/${id}`);
    return response.data;
  },

  // Obter relatório completo do estoque
  async relatorioEstoque(): Promise<RelatorioEstoqueResponse> {
    const response = await api.get<RelatorioEstoqueResponse>('/movimentacao/relatorio/estoque');
    return response.data;
  },
}; 