import { Box } from '@mui/material';
import * as Styled from './styled';

export const TransactionBuilderPageHeader = () => {
  return (
    <>
      <Box pb={1}>
        <Styled.TxBuilderTitle variant="h1">
          Smart Contract Interactions
        </Styled.TxBuilderTitle>
      </Box>
      <Box pb={1} display="flex" gap={2}>
        <Styled.TxBuilderHeaderButton>
          Choose template
        </Styled.TxBuilderHeaderButton>
        <Styled.TxBuilderHeaderButton>
          Save as template
        </Styled.TxBuilderHeaderButton>
      </Box>
    </>
  );
};
