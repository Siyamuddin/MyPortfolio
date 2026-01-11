import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  max-width: 1350px;
  width: 100%;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 12px 16px;
  }
`;

const BreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  
  a {
    color: ${({ theme }) => theme.text_secondary};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
    
    &.active {
      color: ${({ theme }) => theme.text_primary};
      font-weight: 500;
    }
  }
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.text_secondary + '60'};
  display: flex;
  align-items: center;
`;

const Breadcrumbs = ({ items }) => {
  const baseUrl = 'https://siyamuddin.xyz';
  
  const defaultItems = items || [
    { name: 'Home', url: baseUrl },
  ];

  return (
    <BreadcrumbContainer aria-label="Breadcrumb">
      <BreadcrumbItem>
        <a href={baseUrl} aria-label="Home">
          <FaHome />
        </a>
      </BreadcrumbItem>
      {defaultItems.map((item, index) => (
        <React.Fragment key={index}>
          <Separator>
            <FaChevronRight size={10} />
          </Separator>
          <BreadcrumbItem>
            {index === defaultItems.length - 1 ? (
              <span className="active" aria-current="page">{item.name}</span>
            ) : (
              <a href={item.url}>{item.name}</a>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </BreadcrumbContainer>
  );
};

export default Breadcrumbs;

