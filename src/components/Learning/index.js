import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 80px 0;
  background: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  gap: 24px;
`;

const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const LearningGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  margin-top: 40px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LearningCard = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 12px 32px rgba(133, 76, 230, 0.3);
  }
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardIcon = styled.div`
  font-size: 24px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LearningItem = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.card_light || theme.bgLight};
  border-radius: 8px;
  border-left: 3px solid ${({ theme }) => theme.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primary + '80'} 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
`;

const Learning = () => {
  const learningData = {
    currentlyLearning: [
      { name: 'Microservices Architecture', progress: 75 },
      { name: 'Kubernetes & Container Orchestration', progress: 60 },
      { name: 'System Design Patterns', progress: 70 },
      { name: 'Advanced Spring Boot', progress: 85 },
    ],
    readingList: [
      { name: 'Clean Architecture by Robert C. Martin', progress: 40 },
      { name: 'Designing Data-Intensive Applications', progress: 20 },
      { name: 'System Design Interview', progress: 30 },
    ],
    coursesInProgress: [
      { name: 'AWS Certified Solutions Architect', progress: 50 },
      { name: 'Docker & Kubernetes Mastery', progress: 65 },
      { name: 'Advanced Java Concurrency', progress: 80 },
    ],
    skillRoadmap: [
      { name: 'Master Microservices', progress: 70 },
      { name: 'Cloud Architecture (AWS/GCP)', progress: 60 },
      { name: 'DevOps & CI/CD Excellence', progress: 75 },
      { name: 'Distributed Systems', progress: 50 },
    ],
  };

  const learningSections = [
    {
      title: 'Currently Learning',
      icon: '📚',
      items: learningData.currentlyLearning,
    },
    {
      title: 'Reading List',
      icon: '📖',
      items: learningData.readingList,
    },
    {
      title: 'Courses in Progress',
      icon: '🎓',
      items: learningData.coursesInProgress,
    },
    {
      title: 'Skill Development Roadmap',
      icon: '🗺️',
      items: learningData.skillRoadmap,
    },
  ];

  return (
    <Container id="learning">
      <Wrapper>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Title>Learning Journey</Title>
        </motion.div>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Desc>
            Continuous learning is key to growth. Here's what I'm currently working on and planning to master.
          </Desc>
        </motion.div>
        <LearningGrid
          as={motion.div}
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {learningSections.map((section, index) => (
            <LearningCard
              key={index}
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
            >
              <CardTitle>
                <CardIcon>{section.icon}</CardIcon>
                {section.title}
              </CardTitle>
              <ItemList>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <LearningItem>
                      <ItemName>{item.name}</ItemName>
                    </LearningItem>
                    <ProgressBar>
                      <ProgressFill progress={item.progress} />
                    </ProgressBar>
                    <ProgressText>{item.progress}% Complete</ProgressText>
                  </div>
                ))}
              </ItemList>
            </LearningCard>
          ))}
        </LearningGrid>
      </Wrapper>
    </Container>
  );
};

export default Learning;

