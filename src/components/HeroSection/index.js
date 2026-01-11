import React from 'react'
import { motion } from 'framer-motion'
import HeroBgAnimation from '../HeroBgAnimation'
import { HeroContainer, HeroBg, HeroLeftContainer, Img, HeroRightContainer, HeroInnerContainer, TextLoop, Title, Span, SubTitle, SocialMediaIcons, SocialMediaIcon, ResumeButton } from './HeroStyle'
import HeroImg from '../../images/HeroImage.webp'
import Typewriter from 'typewriter-effect';
import { Bio } from '../../data/constants';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, staggerItem } from '../../utils/animations';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaFacebook, 
  FaYoutube 
} from 'react-icons/fa';

const HeroSection = () => {
    const socialLinks = [
        { icon: <FaGithub />, url: Bio.github, label: "GitHub" },
        { icon: <FaLinkedin />, url: Bio.linkedin, label: "LinkedIn" },
        { icon: <FaTwitter />, url: Bio.twitter, label: "Twitter" },
        { icon: <FaInstagram />, url: Bio.insta, label: "Instagram" },
        { icon: <FaFacebook />, url: Bio.facebook, label: "Facebook" },
        { icon: <FaYoutube />, url: Bio.youtube, label: "YouTube" },
    ];

    return (
        <div id="about">
            <HeroContainer>
                <HeroBg>
                    <HeroBgAnimation />
                </HeroBg>
                <HeroInnerContainer
                    as={motion.div}
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    <HeroLeftContainer 
                        id="Left"
                        as={motion.div}
                        variants={slideInRight}
                    >
                        <motion.div variants={staggerItem}>
                            <Title>Hi, I am <br /> {Bio.name}</Title>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                            <TextLoop>
                                I am a
                                <Span>
                                    <Typewriter
                                        options={{
                                            strings: Bio.roles,
                                            autoStart: true,
                                            loop: true,
                                        }}
                                    />
                                </Span>
                            </TextLoop>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                            <SubTitle>{Bio.description}</SubTitle>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                            <ResumeButton 
                                href={Bio.resume} 
                                target='_blank' 
                                rel="noopener noreferrer"
                                aria-label="View Resume"
                            >
                                Check Resume
                            </ResumeButton>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                            <ResumeButton 
                                href={Bio.aibuddy} 
                                target='_blank' 
                                rel="noopener noreferrer" 
                                style={{ marginTop: "20px" }}
                                aria-label="View Projects"
                            >
                                Check my works
                            </ResumeButton>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                            <SocialMediaIcons>
                                {socialLinks.map((social, index) => (
                                    <SocialMediaIcon
                                        key={index}
                                        as={motion.a}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        variants={staggerItem}
                                    >
                                        {social.icon}
                                    </SocialMediaIcon>
                                ))}
                            </SocialMediaIcons>
                        </motion.div>
                    </HeroLeftContainer>

                    <HeroRightContainer 
                        id="Right"
                        as={motion.div}
                        variants={slideInLeft}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Img 
                                src={HeroImg} 
                                alt="Siyam Uddin - Java Backend Developer" 
                                loading="eager" 
                                fetchpriority="high"
                                width="400"
                                height="400"
                            />
                        </motion.div>
                    </HeroRightContainer>
                </HeroInnerContainer>

            </HeroContainer>
        </div>
    )
}

export default HeroSection