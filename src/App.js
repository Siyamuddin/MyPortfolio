import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { initGA, trackPageView, trackScrollDepth, trackTimeOnPage } from './utils/analytics';
import { initPerformanceOptimizations, measureWebVitals } from './utils/performance';
import { darkTheme, lightTheme } from './utils/Themes'
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Experience from "./components/Experience";
import Education from "./components/Education";
import ScrollProgress from "./components/ScrollProgress";
import ParticleBackground from "./components/ParticleBackground";
import QuickJump from "./components/QuickJump";
import StructuredData from "./components/SEO/StructuredData";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import './App.css';

// Lazy load below-the-fold components for better performance
const ProjectDetails = lazy(() => import("./components/ProjectDetails"));
const SocialProof = lazy(() => import("./components/SocialProof"));
const Learning = lazy(() => import("./components/Learning"));
const FAQComponent = lazy(() => import("./components/FAQ").then(module => ({ default: module.default })));
const Blog = lazy(() => import("./components/Blog"));
const ViralHooks = lazy(() => import("./components/ViralHooks"));

// Import faqData separately (not lazy) since it's needed for StructuredData
// We'll import it synchronously for StructuredData, but lazy load the component
import { faqData } from "./components/FAQ";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  transition: all 0.3s ease;
`

const Wrapper = styled.div`
  background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%,30% 98%, 0 100%);
`

const ThemeToggle = styled.button`
  position: fixed;
  right: 20px;
  top: 20px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text_primary};
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.primary};
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    right: 16px;
    top: 16px;
    padding: 8px 12px;
    font-size: 14px;
  }
`

function App() {
  // Load theme preference from localStorage or detect system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return true; // Default to dark
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);
  const [openModal, setOpenModal] = useState({ state: false, project: null });

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    // Add smooth transition class to body
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Initialize Analytics and Performance
  useEffect(() => {
    initGA();
    trackPageView(window.location.pathname + window.location.search);
    initPerformanceOptimizations();
    measureWebVitals();
  }, []);

  // Track scroll depth
  useEffect(() => {
    let scrollDepthTracked = [0, 25, 50, 75, 100];
    let trackedDepths = new Set();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

      scrollDepthTracked.forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.has(depth)) {
          trackedDepths.add(depth);
          trackScrollDepth(depth);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent % 30 === 0 && timeSpent > 0) {
        trackTimeOnPage(timeSpent);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <Router>
          <Helmet>
            <html lang="en" />
            <title>Siyam Uddin – Java Backend Developer Portfolio | Spring Boot & AI Specialist</title>
            <meta name="description" content="Hi, I'm Siyam – a Java Backend Developer skilled in Spring Boot, microservices, and AI-powered applications. Based in Seoul, South Korea. Explore my portfolio, projects, and experience." />
            <meta name="keywords" content="Siyam Uddin, Java Developer, Spring Boot, Backend Developer, AI, Microservices, Portfolio, DevOps Engineer, Software Engineer, Seoul, South Korea, Java Backend Developer Seoul, Spring Boot Developer Korea, AI Application Developer, Microservices Developer" />
            <meta name="author" content="Siyam Uddin" />
            <meta name="geo.region" content="KR-11" />
            <meta name="geo.placename" content="Seoul" />
            <meta name="geo.position" content="37.5665;126.9780" />
            <meta name="ICBM" content="37.5665, 126.9780" />
            
            {/* Open Graph */}
            <meta property="og:title" content="Siyam Uddin – Java Backend Developer Portfolio" />
            <meta property="og:description" content="Explore Siyam's backend development projects, skills, and experience in Java, Spring Boot, and AI applications. Based in Seoul, South Korea." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://siyamuddin.xyz" />
            <meta property="og:image" content="https://siyamuddin.xyz/HeroImage.webp" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Siyam Uddin - Java Backend Developer Portfolio" />
            <meta property="og:site_name" content="Siyam Uddin Portfolio" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:locale:alternate" content="ko_KR" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@SiyamUddin12" />
            <meta name="twitter:title" content="Siyam Uddin – Java Backend Developer Portfolio" />
            <meta name="twitter:description" content="Java Backend Developer specializing in Spring Boot, Microservices, and AI applications. Based in Seoul, South Korea." />
            <meta name="twitter:image" content="https://siyamuddin.xyz/HeroImage.webp" />
            
            {/* Additional Meta */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <link rel="canonical" href="https://siyamuddin.xyz" />
            <link rel="alternate" hrefLang="en" href="https://siyamuddin.xyz" />
            <link rel="alternate" hrefLang="ko" href="https://siyamuddin.xyz/ko" />
            <link rel="alternate" hrefLang="x-default" href="https://siyamuddin.xyz" />
            <link rel="icon" type="image/webp" href="/HeroImage.webp" />
            
            {/* Preconnect for performance */}
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          </Helmet>

          <StructuredData currentPage="Portfolio" faqs={faqData} />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: darkMode ? darkTheme.card : lightTheme.card,
                color: darkMode ? darkTheme.text_primary : lightTheme.text_primary,
                border: `1px solid ${darkMode ? darkTheme.primary : lightTheme.primary}`,
              },
              success: {
                iconTheme: {
                  primary: darkMode ? darkTheme.primary : lightTheme.primary,
                  secondary: darkMode ? darkTheme.text_primary : lightTheme.text_primary,
                },
              },
              error: {
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />

          <ScrollProgress />
          <ParticleBackground />
          <QuickJump />
          <LanguageSwitcher />

          <a href="#about" className="skip-to-content" aria-label="Skip to main content">
            Skip to Content
          </a>
          
          {/* Live region for screen reader announcements */}
          <div role="status" aria-live="polite" aria-atomic="true" className="live-region" id="live-region" />

          <ThemeToggle 
            onClick={toggleTheme}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
              }
            }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
            role="switch"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </ThemeToggle>

        <Navbar />
        <Body>
          <HeroSection />
          <Wrapper>
            <Skills />
            <Experience />
          </Wrapper>
          <Projects openModal={openModal} setOpenModal={setOpenModal} />
          <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
            <SocialProof />
          </Suspense>
          <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
            <Blog />
          </Suspense>
          <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
            <ViralHooks />
          </Suspense>
          <Wrapper>
            <Education />
            <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
              <Learning />
            </Suspense>
            <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
              <FAQComponent />
            </Suspense>
            <Contact />
          </Wrapper>
          <Footer />
          {openModal.state && (
            <Suspense fallback={
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: `4px solid ${darkMode ? darkTheme.primary + '30' : lightTheme.primary + '30'}`,
                  borderTop: `4px solid ${darkMode ? darkTheme.primary : lightTheme.primary}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <div style={{ fontSize: '18px' }}>Loading project details...</div>
              </div>
            }>
              <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
            </Suspense>
          )}
        </Body>
      </Router>
    </ThemeProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
