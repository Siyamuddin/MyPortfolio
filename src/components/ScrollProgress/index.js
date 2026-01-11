import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.progress}%;
  height: 3px;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primary + '99'} 100%);
  z-index: 9999;
  transition: width 0.1s ease-out;
  box-shadow: 0 2px 10px rgba(133, 76, 230, 0.5);
`;

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return <ProgressBar progress={progress} />;
};

export default ScrollProgress;

