import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaFacebook, 
  FaReddit, 
  FaCopy,
  FaShare
} from 'react-icons/fa';
import { trackSocialShare } from '../../utils/analytics';
import toast from 'react-hot-toast';

const ShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 12px;
  margin: 20px 0;
`;

const ShareTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ShareButtonsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ShareButton = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme, platform }) => {
    const colors = {
      twitter: '#1DA1F2',
      linkedin: '#0077b5',
      facebook: '#1877F2',
      reddit: '#FF4500',
      copy: 'transparent'
    };
    return colors[platform] || theme.primary;
  }};
  background: ${({ theme, platform }) => {
    const colors = {
      twitter: '#1DA1F2',
      linkedin: '#0077b5',
      facebook: '#1877F2',
      reddit: '#FF4500',
      copy: 'transparent'
    };
    return colors[platform] ? colors[platform] + '15' : theme.primary + '15';
  }};
  color: ${({ theme, platform }) => {
    const colors = {
      twitter: '#1DA1F2',
      linkedin: '#0077b5',
      facebook: '#1877F2',
      reddit: '#FF4500',
      copy: theme.text_primary
    };
    return colors[platform] || theme.primary;
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${({ theme, platform }) => {
      const colors = {
        twitter: '#1DA1F2',
        linkedin: '#0077b5',
        facebook: '#1877F2',
        reddit: '#FF4500',
        copy: theme.primary + '20'
      };
      return colors[platform] ? colors[platform] + '25' : theme.primary + '25';
    }};
  }
`;

const CopyButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  background: ${({ theme }) => theme.primary + '15'};
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${({ theme }) => theme.primary + '25'};
  }
`;

const ShareButtons = ({ title, description, url, type = 'website' }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = url || window.location.href;
  const shareTitle = title || 'Siyam Uddin - Java Backend Developer Portfolio';

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}`,
  };

  const handleShare = (platform) => {
    trackSocialShare(platform, type);
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      trackSocialShare('copy', type);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <ShareContainer>
      <ShareTitle>
        <FaShare /> Share this {type}
      </ShareTitle>
      <ShareButtonsGrid>
        <ShareButton
          platform="twitter"
          href={shareUrls.twitter}
          onClick={(e) => {
            e.preventDefault();
            handleShare('twitter');
          }}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share on Twitter"
        >
          <FaTwitter /> Twitter
        </ShareButton>
        
        <ShareButton
          platform="linkedin"
          href={shareUrls.linkedin}
          onClick={(e) => {
            e.preventDefault();
            handleShare('linkedin');
          }}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share on LinkedIn"
        >
          <FaLinkedin /> LinkedIn
        </ShareButton>
        
        <ShareButton
          platform="facebook"
          href={shareUrls.facebook}
          onClick={(e) => {
            e.preventDefault();
            handleShare('facebook');
          }}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share on Facebook"
        >
          <FaFacebook /> Facebook
        </ShareButton>
        
        <ShareButton
          platform="reddit"
          href={shareUrls.reddit}
          onClick={(e) => {
            e.preventDefault();
            handleShare('reddit');
          }}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share on Reddit"
        >
          <FaReddit /> Reddit
        </ShareButton>
        
        <CopyButton
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Copy link"
        >
          <FaCopy /> {copied ? 'Copied!' : 'Copy Link'}
        </CopyButton>
      </ShareButtonsGrid>
    </ShareContainer>
  );
};

export default ShareButtons;

