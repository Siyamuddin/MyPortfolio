import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaChevronUp, FaTimes } from 'react-icons/fa';

const JumpButton = styled(motion.button)`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(133, 76, 230, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(133, 76, 230, 0.5);
  }
  
  @media (max-width: 768px) {
    bottom: 80px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
`;

const BackToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  font-size: 20px;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(133, 76, 230, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(133, 76, 230, 0.5);
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
`;

const MenuContainer = styled(motion.div)`
  position: fixed;
  bottom: 160px;
  right: 30px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 16px;
  padding: 16px;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  
  @media (max-width: 768px) {
    bottom: 140px;
    right: 20px;
    min-width: 180px;
  }
`;

const MenuTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuItem = styled.a`
  display: block;
  padding: 10px 12px;
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.primary + '20'};
    color: ${({ theme }) => theme.primary};
    transform: translateX(4px);
  }
  
  &.active {
    background: ${({ theme }) => theme.primary + '20'};
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
  }
`;

const sections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'social-proof', label: 'Social' },
  { id: 'education', label: 'Education' },
  { id: 'learning', label: 'Learning' },
  { id: 'contact', label: 'Contact' },
];

const QuickJump = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      setShowBackToTop(window.scrollY > 500);

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MenuContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <MenuTitle>
              Quick Jump
              <FaTimes
                onClick={() => setIsOpen(false)}
                style={{ cursor: 'pointer', fontSize: '14px' }}
              />
            </MenuTitle>
            {sections.map((section) => (
              <MenuItem
                key={section.id}
                href={`#${section.id}`}
                className={activeSection === section.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(section.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setIsOpen(false);
                  }
                }}
              >
                {section.label}
              </MenuItem>
            ))}
          </MenuContainer>
        )}
      </AnimatePresence>

      <JumpButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Quick navigation menu"
      >
        {isOpen ? <FaTimes /> : <FaChevronUp />}
      </JumpButton>

      {showBackToTop && (
        <BackToTopButton
          onClick={scrollToTop}
          show={showBackToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <FaChevronUp />
        </BackToTopButton>
      )}
    </>
  );
};

export default QuickJump;

