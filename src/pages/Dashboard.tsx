import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../services/authService';
import { ROUTES } from '../routes/constants';
import { 
  Button, 
  Card, 
  Container, 
  Grid, 
  Heading, 
  Text,
  LoadingSpinner
} from '../styles/components';

interface User {
  id: number;
  nome: string;
  matricula: string;
  cargo: string;
}

const DashboardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const DashboardHeader = styled.header`
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DashboardMain = styled.main`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  width: 100%;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const DashboardCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const CardIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserDetails = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const UserDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const DetailItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = authService.getUser();
      const isAuthenticated = authService.isAuthenticated();
      
      if (!currentUser || !isAuthenticated) {
        window.location.href = ROUTES.LOGIN;
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <Text>Carregando...</Text>
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderContent>
          <Heading level={4}>Sistema de Logística</Heading>
          <UserInfo>
            <Text>Olá, {user?.nome}</Text>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </UserInfo>
        </HeaderContent>
      </DashboardHeader>

      <Container>
        <DashboardMain>
          <WelcomeSection>
            <Heading level={2}>Bem-vindo ao Dashboard</Heading>
            <Text size="lg" color="secondary">
              Gerencie suas operações logísticas de forma eficiente
            </Text>
          </WelcomeSection>

          <Grid>
            <DashboardCard>
              <CardIcon>📦</CardIcon>
              <Heading level={3}>Gestão de Estoque</Heading>
              <Text color="secondary">Controle de entrada e saída de produtos</Text>
              <Button 
                size="sm" 
                style={{ marginTop: '16px' }}
                onClick={() => navigate(ROUTES.ESTOQUE)}
              >
                Acessar
              </Button>
            </DashboardCard>

            <DashboardCard>
              <CardIcon>📊</CardIcon>
              <Heading level={3}>Movimentação</Heading>
              <Text color="secondary">Registre entradas e saídas do estoque</Text>
              <Button 
                size="sm" 
                style={{ marginTop: '16px' }}
                onClick={() => navigate(ROUTES.MOVIMENTACAO)}
              >
                Acessar
              </Button>
            </DashboardCard>

            <DashboardCard>
              <CardIcon>🚚</CardIcon>
              <Heading level={3}>Entregas</Heading>
              <Text color="secondary">Acompanhe o status das entregas</Text>
              <Button size="sm" style={{ marginTop: '16px' }}>
                Acessar
              </Button>
            </DashboardCard>

            <DashboardCard>
              <CardIcon>📊</CardIcon>
              <Heading level={3}>Relatórios</Heading>
              <Text color="secondary">Visualize relatórios e métricas</Text>
              <Button size="sm" style={{ marginTop: '16px' }}>
                Acessar
              </Button>
            </DashboardCard>

            <DashboardCard>
              <CardIcon>👥</CardIcon>
              <Heading level={3}>Usuários</Heading>
              <Text color="secondary">Gerencie usuários do sistema</Text>
              <Button size="sm" style={{ marginTop: '16px' }}>
                Acessar
              </Button>
            </DashboardCard>
          </Grid>

          <UserDetails>
            <Heading level={3}>Informações do Usuário</Heading>
            <UserDetailsGrid>
              <DetailItem>
                <Text weight="medium">Nome:</Text> {user?.nome}
              </DetailItem>
              <DetailItem>
                <Text weight="medium">Matrícula:</Text> {user?.matricula}
              </DetailItem>
              <DetailItem>
                <Text weight="medium">Cargo:</Text> {user?.cargo}
              </DetailItem>
            </UserDetailsGrid>
          </UserDetails>
        </DashboardMain>
      </Container>
    </DashboardContainer>
  );
}; 