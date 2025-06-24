import React from 'react'
import { useState } from 'react'
import { Container, Wrapper, Title, Desc, CardContainer, ToggleButtonGroup, ToggleButton, Divider } from './ProjectsStyle'
import ProjectCard from '../Cards/ProjectCards'
import { projects } from '../../data/constants'

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
        <Title>Projects</Title>
        <Desc>
          I have worked on a wide range of projects. Mostly Backend Applications. Here are some of my projects.
        </Desc>
        <ToggleButtonGroup>
          {renderToggleButton('all', 'All')}
          <Divider />
          {renderToggleButton('web app', "WEB APP'S")}
          <Divider />
          {renderToggleButton('machine learning', 'MACHINE LEARNING')}
        </ToggleButtonGroup>
        <CardContainer>
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id}
              project={project} 
              openModal={openModal} 
              setOpenModal={setOpenModal}
            />
          ))}
        </CardContainer>
      </Wrapper>
    </Container>
  )
}

export default Projects