import { Accordion, AccordionSummary } from '@mui/material';
import styled from 'styled-components';

export const TransactionAccordion = styled(Accordion)`
  margin: 10px 0;
  border: none;
  outline: none !important;
  box-shadow: 0px 14px 24px 0px #4c2ffc08 !important;
  border-radius: 10px !important;
  background-color: ${(props) => props.theme.palette.background.secondary};
  &:before {
    display: none;
  };
  overflow: hidden;
  & .MuiAccordionSummary-root {
    border-radius: 10px;
    border: none;
    outline: none;
    & .MuiAccordionSummary-expandIconWrapper {
      margin-left: 15px;
    };
  };
  @media (max-width: 600px){
    & .MuiAccordionSummary-root {
      padding: 0;
      & .MuiAccordionSummary-expandIconWrapper {
        margin-left: 0;
        position: absolute;
        right: 20px;
        top: calc(50% + 6px);
        & > svg {
          fill: ${(props) => props.theme.palette.background.expand};
        }
      }
    }
  };
`;

export const TransactionAccordionSummary = styled(AccordionSummary)`
  border: none !important;
  outline: none !important;
`;
