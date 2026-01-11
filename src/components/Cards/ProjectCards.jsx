import React from 'react'
import styled from 'styled-components'
import { memo } from 'react'


const Button = styled.button`
    display: none;
    width: 100%;
    padding: 10px;
    background-color: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.text_black};
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.8s ease-in-out;
`
const Card = styled.div`
    width: 330px;
    height: 490px;
    background: ${({ theme }) => theme.card};
    background: ${({ theme }) => 
      theme.card === '#171721' 
        ? 'linear-gradient(135deg, rgba(23, 23, 33, 0.9) 0%, rgba(25, 25, 36, 0.9) 100%)'
        : `linear-gradient(135deg, ${theme.card} 0%, ${theme.card} 100%)`
    };
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid ${({ theme }) => theme.primary + '30'};
    cursor: pointer;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
    overflow: hidden;
    padding: 26px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, 
            ${({ theme }) => theme.primary} 0%,
            ${({ theme }) => theme.primary + '80'} 50%,
            ${({ theme }) => theme.primary} 100%
        );
        opacity: 0;
        transition: opacity 0.4s ease;
    }
    
    &:hover {
        transform: translateY(-12px) scale(1.02);
        box-shadow: 0 16px 48px rgba(133, 76, 230, 0.4),
                    0 4px 16px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-color: ${({ theme }) => theme.primary + '60'};
        
        &::before {
            opacity: 1;
        }
    }
    
    &:hover ${Button} {
        display: block;
    }
    
    @media (max-width: 768px) {
        width: 100%;
        max-width: 330px;
    }
`

const Image = styled.img`
    width: 100%;
    height: 180px;
    background-color: ${({ theme }) => theme.white};
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    object-fit: cover;
    transition: transform 0.4s ease;
    
    ${Card}:hover & {
        transform: scale(1.05);
    }
`

const Tags = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
`

const Tag = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => 
      `linear-gradient(135deg, ${theme.primary}20 0%, ${theme.primary}10 100%)`
    };
    backdrop-filter: blur(10px);
    border: 1px solid ${({ theme }) => theme.primary + '30'};
    padding: 4px 10px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    ${Card}:hover & {
        background: ${({ theme }) => 
          `linear-gradient(135deg, ${theme.primary}30 0%, ${theme.primary}20 100%)`
        };
        border-color: ${({ theme }) => theme.primary + '50'};
        transform: translateY(-2px);
    }
`

const Details = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 0px 2px;
`
const Title = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_secondary};
    overflow: hidden;
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Date = styled.div`
    font-size: 12px;
    margin-left: 2px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary + 80};
    @media only screen and (max-width: 768px){
        font-size: 10px;
    }
`


const Description = styled.div`
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary + 99};
    overflow: hidden;
    margin-top: 8px;
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
`

const Members = styled.div`
    display: flex;
    align-items: center;
    padding-left: 10px;
`
const Avatar = styled.img`
    width: 38px;
    height: 38px;
    border-radius: 50%;
    margin-left: -10px;
    background-color: ${({ theme }) => theme.white};
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    border: 3px solid ${({ theme }) => theme.card};
`

const ProjectCards = memo(({project, setOpenModal}) => {
    const handleClick = () => {
        setOpenModal({state: true, project: project});
    };

    return (
        <Card onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
            }
        }} aria-label={`View ${project.title} project details`}>
            <Image 
                src={project.image} 
                alt={project.title}
                loading="lazy"
                width="330"
                height="180"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallback-image.png';
                }}
            />
            <Tags>
                {project.tags?.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                ))}
            </Tags>
            <Details>
                <Title>{project.title}</Title>
                <Date>{project.date}</Date>
                <Description>{project.description}</Description>
            </Details>
            {project.member && (
                <Members>
                    {project.member?.map((member, index) => (
                        <Avatar key={index} src={member.img} alt={member.name} loading="lazy" />
                    ))}
                </Members>
            )}
        </Card>
    );
});

ProjectCards.displayName = 'ProjectCards';

export default ProjectCards