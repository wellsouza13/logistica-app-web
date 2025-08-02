import { api } from './api';

export interface Venda {
  id: number;
  clienteId?: number;
  vendedorId: number;
  dataVenda: string;
  total: number;
  status: 'pendente' | 'aprovada' | 'cancelada';
  observacao?: string;
  itens: VendaItem[];
  cliente?: {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
  };
  vendedor: {
    id: number;
    nome: string;
    matricula: string;
  };
}

export interface VendaItem {
  id: number;
  vendaId: number;
  estoqueId: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  estoque: {
    id: number;
    produto: string;
    unidade: string;
  };
}

export interface RegistrarVendaPayload {
  clienteId?: number;
  observacao?: string;
  itens: Array<{
    estoqueId: number;
    quantidade: number;
    precoUnitario: number;
  }>;
}

export interface RegistrarVendaResponse {
  success: boolean;
  message: string;
  venda: Venda;
}

export interface ListarVendasParams {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  vendedorId?: number;
  clienteId?: number;
}

export interface ListarVendasResponse {
  success: boolean;
  vendas: Venda[];
}

export interface BuscarVendaResponse {
  success: boolean;
  venda: Venda;
}

export const vendasService = {
  // Registrar uma nova venda
  async registrarVenda(payload: RegistrarVendaPayload): Promise<RegistrarVendaResponse> {
    const response = await api.post<RegistrarVendaResponse>('/vendas', payload);
    return response.data;
  },

  // Listar vendas com filtros
  async listarVendas(params?: ListarVendasParams): Promise<ListarVendasResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vendedorId) queryParams.append('vendedorId', params.vendedorId.toString());
    if (params?.clienteId) queryParams.append('clienteId', params.clienteId.toString());

    const response = await api.get<ListarVendasResponse>(`/vendas?${queryParams.toString()}`);
    return response.data;
  },

  // Buscar venda específica
  async buscarVenda(id: number): Promise<BuscarVendaResponse> {
    const response = await api.get<BuscarVendaResponse>(`/vendas/${id}`);
    return response.data;
  },

  // Atualizar status da venda
  async atualizarStatusVenda(id: number, status: string): Promise<{ success: boolean; message: string }> {
    const response = await api.patch<{ success: boolean; message: string }>(`/vendas/${id}/status`, { status });
    return response.data;
  },
}; 