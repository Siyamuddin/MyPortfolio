import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div<{ width?: string; height?: string; borderRadius?: string }>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.card} 0%,
    ${({ theme }) => theme.card_light || theme.card} 50%,
    ${({ theme }) => theme.card} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  border-radius: ${({ borderRadius }) => borderRadius || '4px'};
`;

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  width, 
  height, 
  borderRadius, 
  count = 1,
  className 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBase
          key={index}
          width={width}
          height={height}
          borderRadius={borderRadius}
          className={className}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
