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
import type { ItemEstoque, CriarItemEstoquePayload } from '../services/estoqueService';
import { ROUTES } from '../routes/constants';

// Componentes estilizados específicos da página
const EstoqueContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const EstoqueHeader = styled.header`
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

const EstoqueMain = styled.main`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  width: 100%;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ItemCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ItemActions = styled.div`
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

export const GestaoEstoque: React.FC = () => {
  const navigate = useNavigate();
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemEstoque | null>(null);
  const [formData, setFormData] = useState<CriarItemEstoquePayload>({
    produto: '',
    quantidade: 0,
    unidade: '',
    localizacao: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarEstoque();
  }, []);

  const carregarEstoque = async () => {
    try {
      setLoading(true);
      const response = await estoqueService.listarEstoque();
      setEstoque(response.estoque);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' ? Number(value) : value
    }));
  };

  const abrirModal = (item?: ItemEstoque) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        produto: item.produto,
        quantidade: item.quantidade,
        unidade: item.unidade,
        localizacao: item.localizacao || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        produto: '',
        quantidade: 0,
        unidade: '',
        localizacao: ''
      });
    }
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({
      produto: '',
      quantidade: 0,
      unidade: '',
      localizacao: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingItem) {
        await estoqueService.atualizarItemEstoque(editingItem.id, formData);
      } else {
        await estoqueService.criarItemEstoque(formData);
      }
      
      await carregarEstoque();
      fecharModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      await estoqueService.deletarItemEstoque(id);
      await carregarEstoque();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir item');
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <EstoqueContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <Text>Carregando estoque...</Text>
        </LoadingContainer>
      </EstoqueContainer>
    );
  }

  return (
    <EstoqueContainer>
      <EstoqueHeader>
        <HeaderContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              ← Voltar
            </Button>
            <Heading level={4}>Gestão de Estoque</Heading>
          </div>
          <Button onClick={() => abrirModal()}>
            + Novo Item
          </Button>
        </HeaderContent>
      </EstoqueHeader>

      <Container>
        <EstoqueMain>
          <ActionBar>
            <div>
              <Heading level={2}>Estoque</Heading>
              <Text color="secondary">
                {estoque.length} item{estoque.length !== 1 ? 's' : ''} no estoque
              </Text>
            </div>
          </ActionBar>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {estoque.length === 0 ? (
            <EmptyState>
              <Text size="lg">Nenhum item no estoque</Text>
              <Text color="secondary">Clique em "Novo Item" para começar</Text>
            </EmptyState>
          ) : (
            <Grid>
              {estoque.map((item) => (
                <ItemCard key={item.id}>
                  <ItemInfo>
                    <Heading level={4}>{item.produto}</Heading>
                    <Text>
                      <strong>Quantidade:</strong> {item.quantidade} {item.unidade}
                    </Text>
                    {item.localizacao && (
                      <Text>
                        <strong>Localização:</strong> {item.localizacao}
                      </Text>
                    )}
                    <Text size="sm" color="secondary">
                      Criado em: {formatarData(item.criadoEm)}
                    </Text>
                  </ItemInfo>
                  
                  <ItemActions>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => abrirModal(item)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Excluir
                    </Button>
                  </ItemActions>
                </ItemCard>
              ))}
            </Grid>
          )}
        </EstoqueMain>
      </Container>

      <Modal isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <Heading level={3}>
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </Heading>
            <CloseButton onClick={fecharModal}>&times;</CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="produto">Produto *</Label>
              <Input
                type="text"
                id="produto"
                name="produto"
                value={formData.produto}
                onChange={handleInputChange}
                required
                placeholder="Nome do produto"
                fullWidth
              />
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
                min="0"
                placeholder="0"
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="unidade">Unidade *</Label>
              <Input
                type="text"
                id="unidade"
                name="unidade"
                value={formData.unidade}
                onChange={handleInputChange}
                required
                placeholder="Ex: kg, litros, unidades"
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                type="text"
                id="localizacao"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleInputChange}
                placeholder="Ex: Prateleira A, Setor 3"
                fullWidth
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <Button 
                type="submit" 
                disabled={submitting}
                fullWidth
              >
                {submitting ? 'Salvando...' : (editingItem ? 'Atualizar' : 'Criar')}
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
    </EstoqueContainer>
  );
}; 