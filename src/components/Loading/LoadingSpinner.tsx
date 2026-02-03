import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size?: number; color?: string }>`
  display: inline-block;
  width: ${({ size }) => size || 40}px;
  height: ${({ size }) => size || 40}px;
  border: 4px solid ${({ theme, color }) => color || theme.primary}30;
  border-top: 4px solid ${({ theme, color }) => color || theme.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size, color, className }) => {
  return <SpinnerContainer size={size} color={color} className={className} aria-label="Loading" role="status" />;
};

export default LoadingSpinner;
