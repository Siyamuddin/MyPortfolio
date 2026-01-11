import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Cursor = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
  transform: translate(-50%, -50%);
  display: ${({ visible }) => visible ? 'block' : 'none'};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorDot = styled.div`
  position: fixed;
  width: 6px;
  height: 6px;
  background: ${({ theme }) => theme.primary};
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  display: ${({ visible }) => visible ? 'block' : 'none'};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const updateDot = (e) => {
      setTimeout(() => {
        setDotPosition({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    const hideCursor = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mousemove', updateDot);
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseenter', () => setVisible(true));

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousemove', updateDot);
      document.removeEventListener('mouseleave', hideCursor);
    };
  }, []);

  return (
    <>
      <Cursor
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        visible={visible}
      />
      <CursorDot
        style={{ left: `${dotPosition.x}px`, top: `${dotPosition.y}px` }}
        visible={visible}
      />
    </>
  );
};

export default CustomCursor;

