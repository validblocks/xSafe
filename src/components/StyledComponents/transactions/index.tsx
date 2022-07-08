import { Accordion, AccordionSummary } from '@mui/material';
import styled from 'styled-components';

export const TransactionAccordion = styled(Accordion)`
  margin: 10px 0;
  border: none !important;
  outline: none !important;
  box-shadow: 0px 14px 24px 0px #4c2ffc08 !important;
  border-radius: 10px !important;
  &:before {
    display: none;
  };
`;

export const TransactionAccordionSummary = styled(AccordionSummary)`
  border: none !important;
  outline: none !important;
`;
