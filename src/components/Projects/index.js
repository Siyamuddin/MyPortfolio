import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Container, Wrapper, Title, Desc, CardContainer, ToggleButtonGroup, ToggleButton, Divider } from './ProjectsStyle'
import ProjectCard from '../Cards/ProjectCards'
import { projects } from '../../data/constants'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'

const Projects = ({openModal, setOpenModal}) => {
  const [toggle, setToggle] = useState('all');

  const renderToggleButton = (value, label) => (
    toggle === value 
      ? <ToggleButton active value={value} onClick={() => setToggle(value)}>{label}</ToggleButton>
      : <ToggleButton value={value} onClick={() => setToggle(value)}>{label}</ToggleButton>
  );

  const filteredProjects = toggle === 'all' 
    ? projects
    : projects.filter((item) => item.category === toggle);

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
          <ToggleButtonGroup>
            {renderToggleButton('all', 'All')}
            <Divider />
            {renderToggleButton('web app', "WEB APP'S")}
            <Divider />
            {renderToggleButton('machine learning', 'MACHINE LEARNING')}
          </ToggleButtonGroup>
        </motion.div>
        <CardContainer
          as={motion.div}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key={toggle}
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
      </Wrapper>
    </Container>
  )
}

export default Projects