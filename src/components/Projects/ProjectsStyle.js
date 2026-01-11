import styled from 'styled-components';
import _default from '../../themes/default';

export const Container = styled.div`
    background: linear-gradient(343.07deg, rgba(132, 59, 206, 0.06) 5.71%, rgba(132, 59, 206, 0) 64.83%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;
    align-items: center;
    clip-path: polygon(0 0, 100% 0, 100% 100%,100% 98%, 0 100%);
`;

export const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 100%;
    max-width: 1350px;
    padding: 10px 0px 100px 0;
    gap: 12px;
    @media (max-width: 960px) {
        flex-direction: column;
    }
`;

export const Title = styled.div`
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

export const Desc = styled.div`
    font-size: 18px;
    text-align: center;
    max-width: 600px;
    color: ${({ theme }) => theme.text_secondary};
    @media (max-width: 768px) {
        margin-top: 12px;
        font-size: 16px;
    }
`;

export const ToggleButtonGroup = styled.div`
    display: flex;
    border: 1.5px solid ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    font-size: 16px;
    border-radius: 12px;
    font-weight: 500;
    margin: 22px 0px;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`

export const ToggleButton = styled.div`
    padding: 8px 18px;
    border-radius: 6px;
    cursor: pointer;
    ${({ active, theme }) =>
        active && `
    background: ${theme.primary + 20};
    `
    }
    &:hover {
        background: ${({ theme }) => theme.primary + 8};
    }
    @media (max-width: 768px) {
        padding: 6px 8px;
        border-radius: 4px;
    }
`
export const Divider = styled.div`
    width: 1.5px;
    background: ${({ theme }) => theme.primary};
`


export const CardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
`;

export const SearchContainer = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
    position: relative;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 12px 16px 12px 48px;
    border: 2px solid ${({ theme }) => theme.primary + '40'};
    border-radius: 12px;
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;
    
    &:focus {
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary + '20'};
    }
    
    &::placeholder {
        color: ${({ theme }) => theme.text_secondary};
    }
`;

export const SearchIcon = styled.div`
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.text_secondary};
    font-size: 18px;
`;

export const TechFilterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin: 20px 0;
    max-width: 800px;
`;

export const TechTag = styled.button`
    padding: 6px 14px;
    border: 1px solid ${({ theme, active }) => active ? theme.primary : theme.text_secondary + '40'};
    border-radius: 20px;
    background: ${({ theme, active }) => active ? theme.primary + '20' : 'transparent'};
    color: ${({ theme, active }) => active ? theme.primary : theme.text_secondary};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: ${({ active }) => active ? '600' : '400'};
    
    &:hover {
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) => theme.primary + '10'};
    }
`;

export const ProjectStats = styled.div`
    display: flex;
    justify-content: center;
    gap: 24px;
    margin: 20px 0;
    flex-wrap: wrap;
`;

export const StatItem = styled.div`
    text-align: center;
    padding: 12px 20px;
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.primary + '30'};
    border-radius: 12px;
    min-width: 100px;
`;

export const StatValue = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
    margin-bottom: 4px;
`;

export const StatLabel = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;
