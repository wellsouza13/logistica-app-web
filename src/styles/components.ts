import styled, { css } from 'styled-components';
import type { Theme } from './theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

interface CardProps {
  padding?: keyof Theme['spacing'];
  shadow?: keyof Theme['shadows'];
}

interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans.join(', ')};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  text-decoration: none;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
          color: ${({ theme }) => theme.colors.text.inverse};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
        `;
      
      case 'secondary':
        return css`
          background: ${({ theme }) => theme.colors.gray[100]};
          color: ${({ theme }) => theme.colors.text.primary};
          border: 1px solid ${({ theme }) => theme.colors.gray[300]};
          
          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.gray[200]};
          }
        `;
      
      case 'danger':
        return css`
          background: ${({ theme }) => theme.colors.error[500]};
          color: ${({ theme }) => theme.colors.text.inverse};
          
          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.error[600]};
          }
        `;
      
      case 'ghost':
        return css`
          background: transparent;
          color: ${({ theme }) => theme.colors.text.secondary};
          
          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.gray[100]};
            color: ${({ theme }) => theme.colors.text.primary};
          }
        `;
    }
  }}

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
        `;
      
      case 'md':
        return css`
          padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
          font-size: ${({ theme }) => theme.typography.fontSize.base};
        `;
      
      case 'lg':
        return css`
          padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
          font-size: ${({ theme }) => theme.typography.fontSize.lg};
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme, shadow = 'md' }) => theme.shadows[shadow]};
  padding: ${({ theme, padding = 'lg' }) => theme.spacing[padding]};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const Input = styled.input<InputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, error }) => 
    error ? theme.colors.error[300] : theme.colors.gray[300]};
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

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  ${({ error }) => error && css`
    &:focus {
      border-color: ${({ theme }) => theme.colors.error[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.error[100]};
    }
  `}
`;

export const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  color: ${({ theme }) => theme.colors.error[700]};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 4px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Grid = styled.div<{ columns?: number; gap?: keyof Theme['spacing'] }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme, gap = 'lg' }) => theme.spacing[gap]};
`;

export const Flex = styled.div<{ 
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  gap?: keyof Theme['spacing'];
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'start' }) => align};
  justify-content: ${({ justify = 'start' }) => justify};
  gap: ${({ theme, gap = 'sm' }) => theme.spacing[gap]};
`;

export const Text = styled.span<{
  size?: keyof Theme['typography']['fontSize'];
  weight?: keyof Theme['typography']['fontWeight'];
  color?: keyof Theme['colors']['text'];
}>`
  font-size: ${({ theme, size = 'base' }) => theme.typography.fontSize[size]};
  font-weight: ${({ theme, weight = 'normal' }) => theme.typography.fontWeight[weight]};
  color: ${({ theme, color = 'primary' }) => theme.colors.text[color]};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const Heading = styled.h1<{
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: keyof Theme['colors']['text'];
}>`
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme, color = 'primary' }) => theme.colors.text[color]};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  ${({ level = 1 }) => {
    switch (level) {
      case 1:
        return css`font-size: ${({ theme }) => theme.typography.fontSize['4xl']};`;
      case 2:
        return css`font-size: ${({ theme }) => theme.typography.fontSize['3xl']};`;
      case 3:
        return css`font-size: ${({ theme }) => theme.typography.fontSize['2xl']};`;
      case 4:
        return css`font-size: ${({ theme }) => theme.typography.fontSize.xl};`;
      case 5:
        return css`font-size: ${({ theme }) => theme.typography.fontSize.lg};`;
      case 6:
        return css`font-size: ${({ theme }) => theme.typography.fontSize.base};`;
    }
  }}
`; 