import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Button, 
  Card, 
  Container, 
  Grid, 
  Heading, 
  Text,
  LoadingSpinner,
  Input,
  Label,
  FormGroup,
  ErrorMessage
} from '../styles/components';
import { estoqueService } from '../services/estoqueService';
import type { ItemEstoque } from '../services/estoqueService';
import { movimentacaoService } from '../services/movimentacaoService';
import type { MovimentacaoEstoque, RegistrarEntradaPayload, RegistrarSaidaPayload } from '../services/movimentacaoService';
import { ROUTES } from '../routes/constants';

// Componentes estilizados específicos da página
const MovimentacaoContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const MovimentacaoHeader = styled.header`
  background: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const MovimentacaoMain = styled.main`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  width: 100%;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, active }) => active ? theme.colors.primary[500] : theme.colors.gray[100]};
  color: ${({ theme, active }) => active ? theme.colors.text.inverse : theme.colors.text.primary};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.gray[200]};
  }
`;

const MovimentacaoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MovimentacaoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MovimentacaoActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ tipo: 'ENTRADA' | 'SAIDA' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ theme, tipo }) => 
    tipo === 'ENTRADA' ? theme.colors.success[100] : theme.colors.error[100]};
  color: ${({ theme, tipo }) => 
    tipo === 'ENTRADA' ? theme.colors.success[700] : theme.colors.error[700]};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans.join(', ')};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.normal};
  background: ${({ theme }) => theme.colors.background.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

type TabType = 'entrada' | 'saida' | 'historico' | 'relatorio';

export const MovimentacaoEstoquePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('entrada');
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<RegistrarEntradaPayload | RegistrarSaidaPayload>({
    estoqueId: 0,
    quantidade: 0,
    motivo: '',
    observacao: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [estoqueResponse, movimentacoesResponse] = await Promise.all([
        estoqueService.listarEstoque(),
        movimentacaoService.listarMovimentacoes()
      ]);
      
      setEstoque(estoqueResponse.estoque);
      setMovimentacoes(movimentacoesResponse.movimentacoes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' || name === 'estoqueId' ? Number(value) : value
    }));
  };

  const abrirModal = (tipo: 'ENTRADA' | 'SAIDA') => {
    setTipoMovimentacao(tipo);
    setFormData({
      estoqueId: 0,
      quantidade: 0,
      motivo: '',
      observacao: ''
    });
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setFormData({
      estoqueId: 0,
      quantidade: 0,
      motivo: '',
      observacao: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (tipoMovimentacao === 'ENTRADA') {
        await movimentacaoService.registrarEntrada(formData as RegistrarEntradaPayload);
      } else {
        await movimentacaoService.registrarSaida(formData as RegistrarSaidaPayload);
      }
      
      await carregarDados();
      fecharModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar movimentação');
    } finally {
      setSubmitting(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarQuantidade = (quantidade: number, unidade: string) => {
    return `${quantidade} ${unidade}`;
  };

  if (loading) {
    return (
      <MovimentacaoContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <Text>Carregando dados...</Text>
        </LoadingContainer>
      </MovimentacaoContainer>
    );
  }

  return (
    <MovimentacaoContainer>
      <MovimentacaoHeader>
        <HeaderContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              ← Voltar
            </Button>
            <Heading level={4}>Movimentação de Estoque</Heading>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primary" size="sm" onClick={() => abrirModal('ENTRADA')}>
              + Entrada
            </Button>
            <Button variant="danger" size="sm" onClick={() => abrirModal('SAIDA')}>
              - Saída
            </Button>
          </div>
        </HeaderContent>
      </MovimentacaoHeader>

      <Container>
        <MovimentacaoMain>
          <ActionBar>
            <div>
              <Heading level={2}>Controle de Movimentação</Heading>
              <Text color="secondary">
                Gerencie entradas e saídas do estoque
              </Text>
            </div>
          </ActionBar>

          <TabContainer>
            <Tab 
              active={activeTab === 'entrada'} 
              onClick={() => setActiveTab('entrada')}
            >
              Entradas
            </Tab>
            <Tab 
              active={activeTab === 'saida'} 
              onClick={() => setActiveTab('saida')}
            >
              Saídas
            </Tab>
            <Tab 
              active={activeTab === 'historico'} 
              onClick={() => setActiveTab('historico')}
            >
              Histórico
            </Tab>
            <Tab 
              active={activeTab === 'relatorio'} 
              onClick={() => setActiveTab('relatorio')}
            >
              Relatório
            </Tab>
          </TabContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {activeTab === 'historico' && (
            <Grid>
              {movimentacoes.length === 0 ? (
                <EmptyState>
                  <Text size="lg">Nenhuma movimentação encontrada</Text>
                  <Text color="secondary">Registre uma entrada ou saída para começar</Text>
                </EmptyState>
              ) : (
                movimentacoes.map((mov) => (
                  <MovimentacaoCard key={mov.id}>
                    <MovimentacaoInfo>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Heading level={4}>{mov.estoque.produto}</Heading>
                        <StatusBadge tipo={mov.tipo}>
                          {mov.tipo}
                        </StatusBadge>
                      </div>
                      <Text>
                        <strong>Quantidade:</strong> {formatarQuantidade(mov.quantidade, mov.estoque.unidade)}
                      </Text>
                      <Text>
                        <strong>Motivo:</strong> {mov.motivo}
                      </Text>
                      {mov.observacao && (
                        <Text>
                          <strong>Observação:</strong> {mov.observacao}
                        </Text>
                      )}
                      <Text size="sm" color="secondary">
                        Responsável: {mov.responsavel.matricula} | {formatarData(mov.dataMovimentacao)}
                      </Text>
                    </MovimentacaoInfo>
                  </MovimentacaoCard>
                ))
              )}
            </Grid>
          )}

          {activeTab === 'relatorio' && (
            <Card>
              <Heading level={3}>Relatório de Estoque</Heading>
              <Grid>
                <Card>
                  <Text size="lg" weight="bold">Total de Itens</Text>
                  <Text size="2xl" weight="bold" color="primary">{estoque.length}</Text>
                </Card>
                <Card>
                  <Text size="lg" weight="bold">Com Estoque</Text>
                  <Text size="2xl" weight="bold" color="primary">
                    {estoque.filter(item => item.quantidade > 0).length}
                  </Text>
                </Card>
                <Card>
                  <Text size="lg" weight="bold">Sem Estoque</Text>
                  <Text size="2xl" weight="bold" color="secondary">
                    {estoque.filter(item => item.quantidade === 0).length}
                  </Text>
                </Card>
              </Grid>
            </Card>
          )}
        </MovimentacaoMain>
      </Container>

      <Modal isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <Heading level={3}>
              Registrar {tipoMovimentacao === 'ENTRADA' ? 'Entrada' : 'Saída'}
            </Heading>
            <CloseButton onClick={fecharModal}>&times;</CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="estoqueId">Produto *</Label>
              <Select
                id="estoqueId"
                name="estoqueId"
                value={formData.estoqueId}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um produto</option>
                {estoque.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.produto} - {formatarQuantidade(item.quantidade, item.unidade)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="0"
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="motivo">Motivo *</Label>
              <Select
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um motivo</option>
                <option value="COMPRA">Compra</option>
                <option value="VENDA">Venda</option>
                <option value="AJUSTE">Ajuste</option>
                <option value="PERDA">Perda</option>
                <option value="TRANSFERENCIA">Transferência</option>
                <option value="OUTRO">Outro</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="observacao">Observação</Label>
              <Input
                type="text"
                id="observacao"
                name="observacao"
                value={formData.observacao}
                onChange={handleInputChange}
                placeholder="Observações adicionais"
                fullWidth
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <Button 
                type="submit" 
                disabled={submitting}
                fullWidth
              >
                {submitting ? 'Registrando...' : `Registrar ${tipoMovimentacao === 'ENTRADA' ? 'Entrada' : 'Saída'}`}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={fecharModal}
                fullWidth
              >
                Cancelar
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </MovimentacaoContainer>
  );
}; 