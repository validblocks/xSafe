import { Accordion, AccordionSummary } from '@mui/material';
import styled from 'styled-components';

export const TransactionAccordion = styled(Accordion)`
  margin: 10px 0;
  border: none;
  outline: none !important;
  box-shadow: 0px 14px 24px 0px #4c2ffc08 !important;
  border-radius: 10px !important;
  background-color: ${(props) => props.theme.palette.background.secondary} !important;
  &:before {
    display: none;
  };
  overflow: unset;
  & .MuiAccordionSummary-root {
    border-radius: 10px;
    border: none;
    outline: none;
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
