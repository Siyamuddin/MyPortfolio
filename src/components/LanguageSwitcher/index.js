import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LanguageContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 30px;
  z-index: 1000;
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    top: 80px;
    right: 20px;
    padding: 6px;
  }
`;

const LanguageButton = styled(motion.button)`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.text_secondary};
  font-size: 14px;
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.primary : theme.primary + '20'};
    color: ${({ active, theme }) => active ? 'white' : theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <LanguageContainer>
      <LanguageButton
        active={i18n.language === 'en'}
        onClick={() => changeLanguage('en')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch to English"
      >
        EN
      </LanguageButton>
      <LanguageButton
        active={i18n.language === 'ko'}
        onClick={() => changeLanguage('ko')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch to Korean"
      >
        KO
      </LanguageButton>
    </LanguageContainer>
  );
};

export default LanguageSwitcher;

