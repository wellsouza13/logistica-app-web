import { api } from './api';

export interface ItemEstoque {
  id: number;
  produto: string;
  quantidade: number;
  unidade: string;
  localizacao?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarItemEstoquePayload {
  produto: string;
  quantidade: number;
  unidade: string;
  localizacao?: string;
}

export interface AtualizarItemEstoquePayload {
  produto: string;
  quantidade: number;
  unidade: string;
  localizacao?: string;
}

export interface ListarEstoqueResponse {
  success: boolean;
  estoque: ItemEstoque[];
}

export interface CriarItemEstoqueResponse {
  success: boolean;
  message: string;
  item: ItemEstoque;
}

export interface AtualizarItemEstoqueResponse {
  success: boolean;
  message: string;
  item: ItemEstoque;
}

export interface DeletarItemEstoqueResponse {
  success: boolean;
  message: string;
}

export interface BuscarItemEstoqueResponse {
  success: boolean;
  item: ItemEstoque;
}

export const estoqueService = {
  // Listar todos os itens do estoque
  async listarEstoque(): Promise<ListarEstoqueResponse> {
    const response = await api.get<ListarEstoqueResponse>('/estoque');
    return response.data;
  },

  // Criar novo item no estoque
  async criarItemEstoque(payload: CriarItemEstoquePayload): Promise<CriarItemEstoqueResponse> {
    const response = await api.post<CriarItemEstoqueResponse>('/estoque', payload);
    return response.data;
  },

  // Atualizar item do estoque
  async atualizarItemEstoque(id: number, payload: AtualizarItemEstoquePayload): Promise<AtualizarItemEstoqueResponse> {
    const response = await api.put<AtualizarItemEstoqueResponse>(`/estoque/${id}`, payload);
    return response.data;
  },

  // Deletar item do estoque
  async deletarItemEstoque(id: number): Promise<DeletarItemEstoqueResponse> {
    const response = await api.delete<DeletarItemEstoqueResponse>(`/estoque/${id}`);
    return response.data;
  },

  // Buscar item específico do estoque
  async buscarItemEstoque(id: number): Promise<BuscarItemEstoqueResponse> {
    const response = await api.get<BuscarItemEstoqueResponse>(`/estoque/${id}`);
    return response.data;
  },
}; 