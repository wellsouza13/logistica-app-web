import { api } from './api';

export interface RelatorioGeral {
  totalVendas: number;
  totalEntregas: number;
  itensEstoque: number;
  usuariosAtivos: number;
  receitaMensal: number;
  produtosMaisVendidos: Array<{
    produto: string;
    quantidade: number;
    receita: number;
  }>;
  entregasPorStatus: {
    [key: string]: number;
  };
}

export interface RelatorioVendas {
  vendasPorPeriodo: Array<{
    data: string;
    quantidade: number;
    receita: number;
  }>;
  produtosMaisVendidos: Array<{
    produto: string;
    quantidade: number;
    receita: number;
  }>;
  vendedoresTop: Array<{
    vendedor: string;
    vendas: number;
    receita: number;
  }>;
  receitaPorMes: Array<{
    mes: string;
    receita: number;
  }>;
}

export interface RelatorioEntregas {
  entregasPorStatus: {
    [key: string]: number;
  };
  tempoMedioEntrega: string;
  entregasPorRegiao: Array<{
    regiao: string;
    quantidade: number;
    tempoMedio: string;
  }>;
  motoristasTop: Array<{
    motorista: string;
    entregas: number;
    avaliacao: number;
  }>;
}

export interface RelatorioUsuarios {
  totalUsuarios: number;
  usuariosAtivos: number;
  usuariosPorCargo: {
    [key: string]: number;
  };
  usuariosRecentes: Array<{
    nome: string;
    cargo: string;
    dataCadastro: string;
  }>;
}

export interface RelatorioGeralResponse {
  success: boolean;
  relatorio: RelatorioGeral;
}

export interface RelatorioVendasResponse {
  success: boolean;
  relatorio: RelatorioVendas;
}

export interface RelatorioEntregasResponse {
  success: boolean;
  relatorio: RelatorioEntregas;
}

export interface RelatorioUsuariosResponse {
  success: boolean;
  relatorio: RelatorioUsuarios;
}

export interface RelatorioVendasParams {
  periodo?: string; // formato: "2024-01"
  vendedor?: number;
}

export interface RelatorioEntregasParams {
  status?: string;
  motorista?: number;
}

export const relatoriosService = {
  // Relatório geral do dashboard
  async relatorioGeral(): Promise<RelatorioGeralResponse> {
    const response = await api.get<RelatorioGeralResponse>('/relatorios/geral');
    return response.data;
  },

  // Relatório de vendas
  async relatorioVendas(params?: RelatorioVendasParams): Promise<RelatorioVendasResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.periodo) queryParams.append('periodo', params.periodo);
    if (params?.vendedor) queryParams.append('vendedor', params.vendedor.toString());

    const response = await api.get<RelatorioVendasResponse>(`/relatorios/vendas?${queryParams.toString()}`);
    return response.data;
  },

  // Relatório de entregas
  async relatorioEntregas(params?: RelatorioEntregasParams): Promise<RelatorioEntregasResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.motorista) queryParams.append('motorista', params.motorista.toString());

    const response = await api.get<RelatorioEntregasResponse>(`/relatorios/entregas?${queryParams.toString()}`);
    return response.data;
  },

  // Relatório de usuários
  async relatorioUsuarios(): Promise<RelatorioUsuariosResponse> {
    const response = await api.get<RelatorioUsuariosResponse>('/relatorios/usuarios');
    return response.data;
  },
}; 