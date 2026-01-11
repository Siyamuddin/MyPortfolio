import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Bio } from '../../data/constants';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 60px 0;
  background: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  gap: 24px;
`;

const Title = styled.div`
  font-size: 32px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1000px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled(motion.a)`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 12px 32px rgba(133, 76, 230, 0.3);
  }
`;

const IconWrapper = styled.div`
  font-size: 36px;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 4px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  font-weight: 500;
`;

const LoadingSkeleton = styled.div`
  width: 60px;
  height: 24px;
  background: ${({ theme }) => theme.text_secondary + '30'};
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const SocialProof = () => {
  const [stats, setStats] = useState({
    github: { count: null, loading: true },
    linkedin: { count: null, loading: true },
    twitter: { count: null, loading: true },
    youtube: { count: null, loading: true },
  });

  // Fetch GitHub followers
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const username = Bio.github.split('/').pop();
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            github: { count: data.followers, loading: false }
          }));
        }
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setStats(prev => ({ ...prev, github: { count: null, loading: false } }));
      }
    };

    fetchGitHubStats();
  }, []);

  // Note: LinkedIn, Twitter, and YouTube APIs require authentication
  // For now, we'll use placeholder values that can be updated manually
  useEffect(() => {
    // You can manually set these values or use APIs if you have access
    setStats(prev => ({
      ...prev,
      linkedin: { count: null, loading: false }, // Update manually
      twitter: { count: null, loading: false }, // Update manually
      youtube: { count: null, loading: false }, // Update manually
    }));
  }, []);

  const socialStats = [
    {
      icon: <FaGithub />,
      label: 'GitHub Followers',
      count: stats.github.count,
      loading: stats.github.loading,
      url: Bio.github,
      color: '#333'
    },
    {
      icon: <FaLinkedin />,
      label: 'LinkedIn Connections',
      count: stats.linkedin.count,
      loading: stats.linkedin.loading,
      url: Bio.linkedin,
      color: '#0077b5'
    },
    {
      icon: <FaTwitter />,
      label: 'Twitter Followers',
      count: stats.twitter.count,
      loading: stats.twitter.loading,
      url: Bio.twitter,
      color: '#1DA1F2'
    },
    {
      icon: <FaYoutube />,
      label: 'YouTube Subscribers',
      count: stats.youtube.count,
      loading: stats.youtube.loading,
      url: Bio.youtube,
      color: '#FF0000'
    },
  ];

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Container id="social-proof">
      <Wrapper>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Title>Social Presence</Title>
        </motion.div>
        <StatsContainer
          as={motion.div}
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {socialStats.map((stat, index) => (
            <StatCard
              key={index}
              href={stat.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconWrapper>{stat.icon}</IconWrapper>
              <StatNumber>
                {stat.loading ? (
                  <LoadingSkeleton />
                ) : (
                  formatNumber(stat.count)
                )}
              </StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsContainer>
      </Wrapper>
    </Container>
  );
};

export default SocialProof;

