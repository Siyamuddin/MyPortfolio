import { ThemeProvider } from "styled-components";
import { useState } from "react";
import { darkTheme, lightTheme } from './utils/Themes.js'
import Navbar from "./components/Navbar";
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import HeroSection from "./components/HeroSection";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Experience from "./components/Experience";
import Education from "./components/Education";
import ProjectDetails from "./components/ProjectDetails";
import styled from "styled-components";
import { Helmet } from 'react-helmet';

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
`

const Wrapper = styled.div`
  background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%,30% 98%, 0 100%);
`

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [openModal, setOpenModal] = useState({ state: false, project: null });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Helmet>
          <title>Siyam Uddin – Java Backend Developer Portfolio</title>
          <meta name="description" content="Hi, I'm Siyam – a Java Backend Developer skilled in Spring Boot, microservices, and AI-powered applications. Explore my portfolio and experience." />
          <meta name="keywords" content="Siyam Uddin, Java Developer, Spring Boot, Backend Developer, AI, Microservices, Portfolio, siyamuddin.xyz,siyam,uddin, sejong university,uddin" />
          <meta name="author" content="Siyam Uddin" />
          <meta property="og:title" content="Siyam Uddin – Java Backend Developer" />
          <meta property="og:description" content="Explore Siyam's backend development projects, skills, and experience." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://siyamuddin.xyz" />
          <meta property="og:image" content="https://siyamuddin.xyz/preview.jpg" />
          <link rel="canonical" href="https://siyamuddin.xyz" />
          <link rel="icon" href="/favicon.ico" />
        </Helmet>

        <Navbar />
        <Body>
          <HeroSection />
          <Wrapper>
            <Skills />
            <Experience />
          </Wrapper>
          <Projects openModal={openModal} setOpenModal={setOpenModal} />
          <Wrapper>
            <Education />
            <Contact />
          </Wrapper>
          <Footer />
          {openModal.state &&
            <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
          }
        </Body>
      </Router>
    </ThemeProvider>
  );
}

export default App;
