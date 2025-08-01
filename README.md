# Sistema de Logística

Sistema web para gestão de operações logísticas desenvolvido em React + TypeScript.

## Funcionalidades

- **Autenticação**: Login com matrícula e senha
- **Dashboard**: Interface principal com cards de navegação
- **Interceptors**: Configuração automática de tokens de autenticação
- **Responsivo**: Design adaptável para diferentes dispositivos

## Estrutura do Projeto

```
src/
├── services/
│   ├── api.ts          # Configuração do axios e interceptors
│   ├── interceptors.ts # Interceptors para requisições/respostas
│   └── authService.ts  # Serviços de autenticação
├── styles/
│   ├── theme.ts        # Sistema de tema com cores e espaçamentos
│   ├── components.ts   # Componentes estilizados reutilizáveis
│   └── styled.d.ts    # Declaração de tipos para styled-components
├── pages/
│   ├── Login.tsx       # Página de login
│   └── Dashboard.tsx   # Página do dashboard
└── App.tsx             # Componente principal com rotas
```

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a URL da API criando um arquivo `.env` na raiz do projeto:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

## API Endpoints

O sistema espera os seguintes endpoints na API:

### POST /auth/login
**Payload:**
```json
{
  "matricula": "string",
  "senha": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "nome": "string",
    "matricula": "string",
    "cargo": "string"
  }
}
```

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- Styled Components

## Sistema de Tema

O projeto utiliza **Styled Components** com um sistema de tema completo:

### Cores
- **Primárias**: Azuis para ações principais
- **Secundárias**: Roxos para elementos complementares
- **Neutras**: Cinzas para textos e fundos
- **Status**: Verde (sucesso), Amarelo (aviso), Vermelho (erro)

### Componentes Reutilizáveis
- `Button`: Botões com variantes (primary, secondary, danger, ghost)
- `Card`: Cards com sombras e hover effects
- `Input`: Campos de entrada com validação visual
- `Grid`: Layout responsivo
- `Flex`: Utilitários de flexbox
- `Text` & `Heading`: Tipografia consistente

### Uso do Tema
```tsx
import styled from 'styled-components';

const MyComponent = styled.div`
  color: ${({ theme }) => theme.colors.primary[500]};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
```

## Desenvolvimento

Para executar em modo de desenvolvimento:

```bash
npm run dev
```

Para build de produção:

```bash
npm run build
```
