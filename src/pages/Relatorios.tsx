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
import { relatoriosService } from '../services/relatoriosService';
import type { 
  RelatorioGeral, 
  RelatorioVendas, 
  RelatorioEntregas, 
  RelatorioUsuarios 
} from '../services/relatoriosService';
import { ROUTES } from '../routes/constants';

// Componentes estilizados específicos da página
const RelatoriosContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const RelatoriosHeader = styled.header`
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

const RelatoriosMain = styled.main`
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

const MetricCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ theme, status }) => {
    switch (status) {
      case 'entregue': return theme.colors.success[100];
      case 'em_transito': return theme.colors.warning[100];
      case 'pendente': return theme.colors.error[100];
      default: return theme.colors.gray[100];
    }
  }};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'entregue': return theme.colors.success[700];
      case 'em_transito': return theme.colors.warning[700];
      case 'pendente': return theme.colors.error[700];
      default: return theme.colors.gray[700];
    }
  }};
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

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

type TabType = 'geral' | 'vendas' | 'entregas' | 'usuarios';

export const Relatorios: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('geral');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados dos relatórios
  const [relatorioGeral, setRelatorioGeral] = useState<RelatorioGeral | null>(null);
  const [relatorioVendas, setRelatorioVendas] = useState<RelatorioVendas | null>(null);
  const [relatorioEntregas, setRelatorioEntregas] = useState<RelatorioEntregas | null>(null);
  const [relatorioUsuarios, setRelatorioUsuarios] = useState<RelatorioUsuarios | null>(null);

  // Filtros
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    carregarRelatorioGeral();
  }, []);

  const carregarRelatorioGeral = async () => {
    try {
      setLoading(true);
      const response = await relatoriosService.relatorioGeral();
      setRelatorioGeral(response.relatorio);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar relatório geral');
    } finally {
      setLoading(false);
    }
  };

  const carregarRelatorioVendas = async () => {
    try {
      setLoading(true);
      const params = filtroPeriodo ? { periodo: filtroPeriodo } : undefined;
      const response = await relatoriosService.relatorioVendas(params);
      setRelatorioVendas(response.relatorio);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar relatório de vendas');
    } finally {
      setLoading(false);
    }
  };

  const carregarRelatorioEntregas = async () => {
    try {
      setLoading(true);
      const params = filtroStatus ? { status: filtroStatus } : undefined;
      const response = await relatoriosService.relatorioEntregas(params);
      setRelatorioEntregas(response.relatorio);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar relatório de entregas');
    } finally {
      setLoading(false);
    }
  };

  const carregarRelatorioUsuarios = async () => {
    try {
      setLoading(true);
      const response = await relatoriosService.relatorioUsuarios();
      setRelatorioUsuarios(response.relatorio);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar relatório de usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setError('');
    
    switch (tab) {
      case 'vendas':
        carregarRelatorioVendas();
        break;
      case 'entregas':
        carregarRelatorioEntregas();
        break;
      case 'usuarios':
        carregarRelatorioUsuarios();
        break;
      default:
        carregarRelatorioGeral();
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading && !relatorioGeral) {
    return (
      <RelatoriosContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <Text>Carregando relatórios...</Text>
        </LoadingContainer>
      </RelatoriosContainer>
    );
  }

  return (
    <RelatoriosContainer>
      <RelatoriosHeader>
        <HeaderContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              ← Voltar
            </Button>
            <Heading level={4}>Relatórios</Heading>
          </div>
        </HeaderContent>
      </RelatoriosHeader>

      <Container>
        <RelatoriosMain>
          <ActionBar>
            <div>
              <Heading level={2}>Relatórios do Sistema</Heading>
              <Text color="secondary">
                Visualize métricas e estatísticas gerais
              </Text>
            </div>
          </ActionBar>

          <TabContainer>
            <Tab 
              active={activeTab === 'geral'} 
              onClick={() => handleTabChange('geral')}
            >
              Geral
            </Tab>
            <Tab 
              active={activeTab === 'vendas'} 
              onClick={() => handleTabChange('vendas')}
            >
              Vendas
            </Tab>
            <Tab 
              active={activeTab === 'entregas'} 
              onClick={() => handleTabChange('entregas')}
            >
              Entregas
            </Tab>
            <Tab 
              active={activeTab === 'usuarios'} 
              onClick={() => handleTabChange('usuarios')}
            >
              Usuários
            </Tab>
          </TabContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {activeTab === 'geral' && relatorioGeral && (
            <div>
              <Grid>
                <MetricCard>
                  <MetricLabel>Total de Vendas</MetricLabel>
                  <MetricValue>{relatorioGeral.totalVendas}</MetricValue>
                </MetricCard>
                <MetricCard>
                  <MetricLabel>Total de Entregas</MetricLabel>
                  <MetricValue>{relatorioGeral.totalEntregas}</MetricValue>
                </MetricCard>
                <MetricCard>
                  <MetricLabel>Itens em Estoque</MetricLabel>
                  <MetricValue>{relatorioGeral.itensEstoque}</MetricValue>
                </MetricCard>
                <MetricCard>
                  <MetricLabel>Usuários Ativos</MetricLabel>
                  <MetricValue>{relatorioGeral.usuariosAtivos}</MetricValue>
                </MetricCard>
                <MetricCard>
                  <MetricLabel>Receita Mensal</MetricLabel>
                  <MetricValue>{formatarMoeda(relatorioGeral.receitaMensal)}</MetricValue>
                </MetricCard>
              </Grid>

              <Grid style={{ marginTop: '32px' }}>
                <Card>
                  <Heading level={3}>Produtos Mais Vendidos</Heading>
                  {relatorioGeral.produtosMaisVendidos.map((produto, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '8px 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <Text>{produto.produto}</Text>
                      <Text>{produto.quantidade} unidades</Text>
                    </div>
                  ))}
                </Card>

                <Card>
                  <Heading level={3}>Entregas por Status</Heading>
                  {Object.entries(relatorioGeral.entregasPorStatus).map(([status, quantidade]) => (
                    <div key={status} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <StatusBadge status={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </StatusBadge>
                      <Text>{quantidade}</Text>
                    </div>
                  ))}
                </Card>
              </Grid>
            </div>
          )}

          {activeTab === 'vendas' && (
            <div>
              <FilterContainer>
                <FilterGroup>
                  <Label>Período</Label>
                  <Select 
                    value={filtroPeriodo} 
                    onChange={(e) => setFiltroPeriodo(e.target.value)}
                  >
                    <option value="">Todos os períodos</option>
                    <option value="2024-01">Janeiro 2024</option>
                    <option value="2024-02">Fevereiro 2024</option>
                    <option value="2024-03">Março 2024</option>
                  </Select>
                </FilterGroup>
                <Button onClick={carregarRelatorioVendas}>
                  Filtrar
                </Button>
              </FilterContainer>

              {relatorioVendas && (
                <Grid>
                  <Card>
                    <Heading level={3}>Vendas por Período</Heading>
                    {relatorioVendas.vendasPorPeriodo.map((venda, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '8px 0',
                        borderBottom: '1px solid #eee'
                      }}>
                        <Text>{formatarData(venda.data)}</Text>
                        <Text>{venda.quantidade} vendas</Text>
                        <Text>{formatarMoeda(venda.receita)}</Text>
                      </div>
                    ))}
                  </Card>

                  <Card>
                    <Heading level={3}>Vendedores Top</Heading>
                    {relatorioVendas.vendedoresTop.map((vendedor, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '8px 0',
                        borderBottom: '1px solid #eee'
                      }}>
                        <Text>{vendedor.vendedor}</Text>
                        <Text>{vendedor.vendas} vendas</Text>
                        <Text>{formatarMoeda(vendedor.receita)}</Text>
                      </div>
                    ))}
                  </Card>
                </Grid>
              )}
            </div>
          )}

          {activeTab === 'entregas' && (
            <div>
              <FilterContainer>
                <FilterGroup>
                  <Label>Status</Label>
                  <Select 
                    value={filtroStatus} 
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_transito">Em Trânsito</option>
                    <option value="entregue">Entregue</option>
                  </Select>
                </FilterGroup>
                <Button onClick={carregarRelatorioEntregas}>
                  Filtrar
                </Button>
              </FilterContainer>

              {relatorioEntregas && (
                <Grid>
                  <Card>
                    <Heading level={3}>Entregas por Status</Heading>
                    <Text>Tempo Médio: {relatorioEntregas.tempoMedioEntrega}</Text>
                    {Object.entries(relatorioEntregas.entregasPorStatus).map(([status, quantidade]) => (
                      <div key={status} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #eee'
                      }}>
                        <StatusBadge status={status}>
                          {status.replace('_', ' ').toUpperCase()}
                        </StatusBadge>
                        <Text>{quantidade}</Text>
                      </div>
                    ))}
                  </Card>

                  <Card>
                    <Heading level={3}>Motoristas Top</Heading>
                    {relatorioEntregas.motoristasTop.map((motorista, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '8px 0',
                        borderBottom: '1px solid #eee'
                      }}>
                        <Text>{motorista.motorista}</Text>
                        <Text>{motorista.entregas} entregas</Text>
                        <Text>⭐ {motorista.avaliacao.toFixed(1)}</Text>
                      </div>
                    ))}
                  </Card>
                </Grid>
              )}
            </div>
          )}

          {activeTab === 'usuarios' && relatorioUsuarios && (
            <Grid>
              <MetricCard>
                <MetricLabel>Total de Usuários</MetricLabel>
                <MetricValue>{relatorioUsuarios.totalUsuarios}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricLabel>Usuários Ativos</MetricLabel>
                <MetricValue>{relatorioUsuarios.usuariosAtivos}</MetricValue>
              </MetricCard>

              <Card>
                <Heading level={3}>Usuários por Cargo</Heading>
                {Object.entries(relatorioUsuarios.usuariosPorCargo).map(([cargo, quantidade]) => (
                  <div key={cargo} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <Text>{cargo}</Text>
                    <Text>{quantidade}</Text>
                  </div>
                ))}
              </Card>

              <Card>
                <Heading level={3}>Usuários Recentes</Heading>
                {relatorioUsuarios.usuariosRecentes.map((usuario, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <Text>{usuario.nome}</Text>
                    <Text>{usuario.cargo}</Text>
                    <Text>{formatarData(usuario.dataCadastro)}</Text>
                  </div>
                ))}
              </Card>
            </Grid>
          )}
        </RelatoriosMain>
      </Container>
    </RelatoriosContainer>
  );
}; 