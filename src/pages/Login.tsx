import React, { useState } from 'react';
import styled from 'styled-components';
import { authService } from '../services/authService';
import type { LoginPayload } from '../services/authService';
import { 
  Button, 
  Input, 
  Label, 
  FormGroup, 
  ErrorMessage, 
  Heading,
  Text,
} from '../styles/components';

const LoginContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginPayload>({
    matricula: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <Heading level={1} color="primary">Sistema de Logística</Heading>
          <Text size="sm" color="secondary">Faça login para continuar</Text>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleInputChange}
              required
              placeholder="Digite sua matrícula"
              fullWidth
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="senha">Senha</Label>
            <Input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
              placeholder="Digite sua senha"
              fullWidth
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button 
            type="submit" 
            fullWidth
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
}; 