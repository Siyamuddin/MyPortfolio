import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
`;

const Spinner = styled.div<{ theme: any }>`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.primary}30;
  border-top: 4px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const LoadingFallback: React.FC = () => (
  <LoadingContainer>
    <Spinner />
  </LoadingContainer>
);

export default LoadingFallback;
