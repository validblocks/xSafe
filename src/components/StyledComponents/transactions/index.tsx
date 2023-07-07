import { Accordion, AccordionSummary } from '@mui/material';
import styled from 'styled-components';

export const TransactionAccordion = styled(Accordion)`
  margin: 10px 0;
  border: none;
  outline: none !important;
  box-shadow: 0px 14px 24px 0px #4c2ffc08 !important;
  border-radius: 10px !important;
  background-color: ${(props) => props.theme.palette.background.secondary} !important;
  transition: background 0.2s ease 0s, border 0.2s ease 0s !important;
  border: 1px solid transparent;
  &.MuiPaper-root.MuiAccordion-root.Mui-expanded {
    margin: 10px 0;
  }
  
  &:hover {
    border: 1px solid #4c2ffc;
    & .MuiAccordionSummary-root {
      background: rgba(76, 47, 252, 0.15) !important;
    }
    & .MuiCollapse-root {
      background: rgba(76, 47, 252, 0.05) !important;
    }
  }
  &:before {
    display: none;
  };
  overflow: unset;
  & .MuiAccordionSummary-root {
    border-radius: 10px;
    border: none;
    outline: none;
    padding-left: 0;
    & .MuiAccordionSummary-expandIconWrapper {
      margin-left: 15px;
      & > svg {
          fill: ${(props) => props.theme.palette.background.expand};
        }
    };
  };
  @media (max-width: 600px){
    & .MuiAccordionSummary-root {
      padding: 0;
    }
    & .MuiAccordionSummary-expandIconWrapper {
      margin: 5px !important;
      & > svg {
          fill: ${(props) => props.theme.palette.background.transactionsExpand} !important;
        }
    };
  };
`;

export const TransactionAccordionSummary = styled(AccordionSummary)`
  border: none !important;
  outline: none !important;
`;
