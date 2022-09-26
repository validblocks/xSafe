import { AccordionSummary, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TransactionAccordion } from 'src/components/StyledComponents/transactions';
import styled from 'styled-components';

export const UndelegationContainer = styled(Box)`
  padding: 0 !important;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  max-height: 310;
  min-height: 310;
  overflow: scroll;
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
  margin: 15px 0 !important;
  width: 100%;
`;

export const UndelegationAccordionSummary = styled(AccordionSummary)(
  ({ theme: _ }) => ({
    outline: 'none !important',
    flexWrap: 'wrap',
    width: '100 %',
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
