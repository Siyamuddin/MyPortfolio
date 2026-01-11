import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ShareButtons from '../ShareButtons';
import { FaRocket, FaShareAlt } from 'react-icons/fa';

const ViralSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.primary + '15'} 0%, ${({ theme }) => theme.primary + '05'} 100%);
  border: 2px dashed ${({ theme }) => theme.primary + '40'};
  border-radius: 20px;
  padding: 40px;
  margin: 60px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${({ theme }) => theme.primary + '10'} 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
`;

const ViralTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ViralDescription = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;

const CTAButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primary + 'CC'} 100%);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(133, 76, 230, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(133, 76, 230, 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 16px;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 32px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ViralHooks = () => {
  const portfolioUrl = 'https://siyamuddin.xyz';
  
  return (
    <ViralSection>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ViralTitle>
          <FaRocket /> Love This Portfolio?
        </ViralTitle>
        <ViralDescription>
          If you found this portfolio helpful or inspiring, please share it with others! Help spread the word about modern web development and backend engineering.
        </ViralDescription>
        
        <CTAContainer>
          <CTAButton
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this amazing portfolio by @SiyamUddin12 - A Java Backend Developer specializing in Spring Boot and AI applications! 🚀')}&url=${encodeURIComponent(portfolioUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShareAlt /> Share on Twitter
          </CTAButton>
          
          <ShareButtons 
            title="Siyam Uddin - Java Backend Developer Portfolio"
            description="Explore backend development projects, skills, and experience in Java, Spring Boot, and AI applications."
            url={portfolioUrl}
            type="portfolio"
          />
        </CTAContainer>
        
        <StatsContainer>
          <StatItem>
            <StatNumber>6+</StatNumber>
            <StatLabel>Projects</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>2+</StatNumber>
            <StatLabel>Years Experience</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>100%</StatNumber>
            <StatLabel>Open Source</StatLabel>
          </StatItem>
        </StatsContainer>
      </motion.div>
    </ViralSection>
  );
};

export default ViralHooks;

