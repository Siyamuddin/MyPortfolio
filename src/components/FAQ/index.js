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

const FAQContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 4px 16px rgba(133, 76, 230, 0.2);
  }
`;

const Question = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Answer = styled(motion.div)`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 12px;
  line-height: 1.6;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Icon = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.primary};
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in Java and Spring Boot for backend development, with expertise in microservices architecture, AI applications using LangChain4j and Llama3, cloud deployment on AWS, and DevOps practices including Docker, CI/CD, and Redis caching."
    },
    {
      question: "Where are you located?",
      answer: "I'm currently based in Seoul, South Korea, where I'm pursuing my Bachelor's degree in Computer Science and Engineering at Sejong University, and working as a Backend & Infra Engineering Intern."
    },
    {
      question: "What kind of projects have you worked on?",
      answer: "I've worked on various backend applications including AI-powered student support systems, e-commerce platforms, real-time chat applications, and task management systems. Most of my projects focus on scalable, secure, and efficient backend solutions using Java and Spring Boot."
    },
    {
      question: "Are you available for freelance or full-time opportunities?",
      answer: "Yes, I'm open to both freelance projects and full-time opportunities. Feel free to reach out through the contact form or connect with me on LinkedIn to discuss potential collaborations."
    },
    {
      question: "Do you have experience with cloud platforms?",
      answer: "Yes, I have hands-on experience with AWS, including EC2, deployment, and infrastructure management. I've deployed multiple applications on AWS and implemented CI/CD pipelines for automated deployments."
    },
    {
      question: "What makes your approach to backend development unique?",
      answer: "I focus on building scalable, maintainable systems with a strong emphasis on security, performance optimization (like Redis caching), and modern practices such as microservices architecture. I also integrate AI capabilities to enhance application functionality, as seen in my AiBuddy project."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Container id="faq">
      <Wrapper>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Title>Frequently Asked Questions</Title>
        </motion.div>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Desc>
            Have questions? Here are some common questions about my work, experience, and availability.
          </Desc>
        </motion.div>
        <FAQContainer
          as={motion.div}
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              variants={staggerItem}
              onClick={() => toggleFAQ(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFAQ(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={openIndex === index}
            >
              <Question>
                <span>{faq.question}</span>
                <Icon isOpen={openIndex === index}>▼</Icon>
              </Question>
              {openIndex === index && (
                <Answer
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </Answer>
              )}
            </FAQItem>
          ))}
        </FAQContainer>
      </Wrapper>
    </Container>
  );
};

// Export FAQs for structured data
export const faqData = [
  {
    question: "What technologies do you specialize in?",
    answer: "I specialize in Java and Spring Boot for backend development, with expertise in microservices architecture, AI applications using LangChain4j and Llama3, cloud deployment on AWS, and DevOps practices including Docker, CI/CD, and Redis caching."
  },
  {
    question: "Where are you located?",
    answer: "I'm currently based in Seoul, South Korea, where I'm pursuing my Bachelor's degree in Computer Science and Engineering at Sejong University, and working as a Backend & Infra Engineering Intern."
  },
  {
    question: "What kind of projects have you worked on?",
    answer: "I've worked on various backend applications including AI-powered student support systems, e-commerce platforms, real-time chat applications, and task management systems. Most of my projects focus on scalable, secure, and efficient backend solutions using Java and Spring Boot."
  },
  {
    question: "Are you available for freelance or full-time opportunities?",
    answer: "Yes, I'm open to both freelance projects and full-time opportunities. Feel free to reach out through the contact form or connect with me on LinkedIn to discuss potential collaborations."
  },
  {
    question: "Do you have experience with cloud platforms?",
    answer: "Yes, I have hands-on experience with AWS, including EC2, deployment, and infrastructure management. I've deployed multiple applications on AWS and implemented CI/CD pipelines for automated deployments."
  },
  {
    question: "What makes your approach to backend development unique?",
    answer: "I focus on building scalable, maintainable systems with a strong emphasis on security, performance optimization (like Redis caching), and modern practices such as microservices architecture. I also integrate AI capabilities to enhance application functionality, as seen in my AiBuddy project."
  }
];

export default FAQ;

