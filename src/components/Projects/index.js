import React from 'react'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Container, 
  Wrapper, 
  Title, 
  Desc, 
  CardContainer, 
  ToggleButtonGroup, 
  ToggleButton, 
  Divider,
  SearchContainer,
  SearchInput,
  SearchIcon,
  TechFilterContainer,
  TechTag,
  ProjectStats,
  StatItem,
  StatValue,
  StatLabel
} from './ProjectsStyle'
import ProjectCard from '../Cards/ProjectCards'
import { projects } from '../../data/constants'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'
import { FaSearch } from 'react-icons/fa'

const Projects = ({openModal, setOpenModal}) => {
  const [toggle, setToggle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);

  // Extract all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set();
    projects.forEach(project => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => {
          if (typeof tag === 'string') {
            // Handle comma-separated tags
            tag.split(',').forEach(t => techSet.add(t.trim()));
          }
        });
      }
    });
    return Array.from(techSet).sort();
  }, []);

  const renderToggleButton = (value, label) => (
    toggle === value 
      ? <ToggleButton active value={value} onClick={() => setToggle(value)}>{label}</ToggleButton>
      : <ToggleButton value={value} onClick={() => setToggle(value)}>{label}</ToggleButton>
  );

  // Enhanced filtering with search and tech filter
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Category filter
    if (toggle !== 'all') {
      filtered = filtered.filter((item) => item.category === toggle);
    }

    // Technology filter
    if (selectedTech) {
      filtered = filtered.filter((project) => {
        if (!project.tags) return false;
        return project.tags.some(tag => {
          const tagStr = typeof tag === 'string' ? tag : '';
          return tagStr.toLowerCase().includes(selectedTech.toLowerCase());
        });
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project) => {
        const titleMatch = project.title?.toLowerCase().includes(query);
        const descMatch = project.description?.toLowerCase().includes(query);
        const tagMatch = project.tags?.some(tag => {
          const tagStr = typeof tag === 'string' ? tag : '';
          return tagStr.toLowerCase().includes(query);
        });
        return titleMatch || descMatch || tagMatch;
      });
    }

    return filtered;
  }, [toggle, searchQuery, selectedTech]);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    return {
      total: projects.length,
      showing: filteredProjects.length,
      technologies: allTechnologies.length,
      categories: new Set(projects.map(p => p.category)).size
    };
  }, [filteredProjects, allTechnologies]);

  return (
    <Container id="projects">
      <Wrapper>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Title>Projects</Title>
        </motion.div>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Desc>
            I have worked on a wide range of projects. Mostly Backend Applications. Here are some of my projects.
          </Desc>
        </motion.div>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search projects by name, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.25 }}
        >
          <ProjectStats>
            <StatItem>
              <StatValue>{projectStats.total}</StatValue>
              <StatLabel>Total Projects</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{projectStats.showing}</StatValue>
              <StatLabel>Showing</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{projectStats.technologies}</StatValue>
              <StatLabel>Technologies</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{projectStats.categories}</StatValue>
              <StatLabel>Categories</StatLabel>
            </StatItem>
          </ProjectStats>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
        >
          <ToggleButtonGroup>
            {renderToggleButton('all', 'All')}
            <Divider />
            {renderToggleButton('web app', "WEB APP'S")}
            <Divider />
            {renderToggleButton('machine learning', 'MACHINE LEARNING')}
          </ToggleButtonGroup>
        </motion.div>

        {allTechnologies.length > 0 && (
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ delay: 0.35 }}
          >
            <TechFilterContainer>
              <TechTag
                active={selectedTech === null}
                onClick={() => setSelectedTech(null)}
              >
                All Tech
              </TechTag>
              {allTechnologies.slice(0, 10).map((tech) => (
                <TechTag
                  key={tech}
                  active={selectedTech === tech}
                  onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                >
                  {tech}
                </TechTag>
              ))}
            </TechFilterContainer>
          </motion.div>
        )}
        {filteredProjects.length > 0 ? (
          <CardContainer
            as={motion.div}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            key={`${toggle}-${searchQuery}-${selectedTech}`}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={staggerItem}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard 
                  project={project} 
                  openModal={openModal} 
                  setOpenModal={setOpenModal}
                />
              </motion.div>
            ))}
          </CardContainer>
        ) : (
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              No projects found
            </div>
            <div style={{ fontSize: '16px', opacity: 0.8 }}>
              Try adjusting your search or filters
            </div>
          </motion.div>
        )}
      </Wrapper>
    </Container>
  )
}

export default Projects