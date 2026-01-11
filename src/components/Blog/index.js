import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { blogPosts } from '../../data/blogPosts';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';
import { FaCalendar, FaClock, FaArrowRight } from 'react-icons/fa';

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

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  width: 100%;
  margin-top: 40px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const BlogCard = styled(motion.a)`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 12px 32px rgba(133, 76, 230, 0.3);
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: ${({ theme }) => theme.bgLight};
`;

const BlogContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BlogTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BlogExcerpt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  align-items: center;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary + '15'};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
`;

const ReadMore = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: 14px;
  margin-top: 8px;
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 1;
`;

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', ...new Set(blogPosts.map(post => post.category))];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <Container id="blog">
      <Wrapper>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Title>Blog & Articles</Title>
        </motion.div>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Desc>
            Insights, tutorials, and thoughts on backend development, AI applications, and software engineering.
          </Desc>
        </motion.div>
        
        {categories.length > 1 && (
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${selectedCategory === category ? '#854CE6' : 'rgba(255,255,255,0.2)'}`,
                  background: selectedCategory === category ? '#854CE620' : 'transparent',
                  color: selectedCategory === category ? '#854CE6' : 'inherit',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedCategory === category ? '600' : '400',
                  textTransform: 'capitalize'
                }}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        <BlogGrid
          as={motion.div}
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          key={selectedCategory}
        >
          {filteredPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              href={`/blog/${post.slug}`}
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              style={{ position: 'relative' }}
            >
              {post.featured && <FeaturedBadge>Featured</FeaturedBadge>}
              <BlogImage 
                src={post.image} 
                alt={post.title}
                loading="lazy"
              />
              <BlogContent>
                <BlogTitle>{post.title}</BlogTitle>
                <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                <BlogMeta>
                  <MetaItem>
                    <FaCalendar /> {new Date(post.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </MetaItem>
                  <MetaItem>
                    <FaClock /> {post.readTime}
                  </MetaItem>
                </BlogMeta>
                <TagsContainer>
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                </TagsContainer>
                <ReadMore>
                  Read More <FaArrowRight />
                </ReadMore>
              </BlogContent>
            </BlogCard>
          ))}
        </BlogGrid>
      </Wrapper>
    </Container>
  );
};

export default Blog;

