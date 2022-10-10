import { AccordionSummary, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TransactionAccordion } from 'src/components/StyledComponents/transactions';
import styled from 'styled-components';

export const UndelegationContainer = styled(Box)`
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  overflow: scroll;
  & > .MuiPaper-root:last-child {
    margin-bottom: 0 !important;
  }
`;

export const NoUndelegationsTypography = styled(Typography)`
  width: 100%;
  margin-top: calc(50% - 100px);
  color: gray;
  text-align: center;
  font-size: 22px;
`;

export const UndelegationAccordion = styled(TransactionAccordion)`
  overflow: scroll;
  margin: 0 0 12px 0 !important;
  width: 100%;
`;

export const UndelegationAccordionSummary = styled(AccordionSummary)(
  ({ theme: _ }) => ({
    outline: 'none !important',
    flexWrap: 'wrap',
    width: '100%',
    padding: '0',
    '& .MuiAccordionSummary-expandIconWrapper': {
      width: '100% !important',
      justifyContent: 'center !important',
      alignItems: 'center !important',
      backgroundColor: '#F3F6FC',
      padding: '0.25rem',
    },
  }),
);

export const UndelegationGridContainer = styled(Grid)(({ theme: _ }) => ({
  padding: '0.5rem 1.25rem 0.55rem',
  backgroundColor: '#F3F6FC',
  width: '100% !important',
  border: 'solid 1px #eee',
  borderRadius: '10px',
  transition: 'all .2s linear',
  ':hover': {
    backgroundColor: '#ffff !important',
    borderColor: '#4c2ffc',
    boxShadow: 'inset 0px 0px 6px #4c2ffc2e !important',
  },
}));