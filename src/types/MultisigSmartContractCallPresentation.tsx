import { operations } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import i18next from 'i18next';
import { denomination } from 'src/config';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';
import BigNumber from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import useTokenPhoto from 'src/utils/useTokenPhoto';

const StyledTypography = withStyles({
  root: {
    letterSpacing: 0.5,
  },
})(Typography);

interface IMultisigSmartContractCallPresentationProps {
    address: Address;
    amount: BigNumber;
    identifier: string;
}

const MultisigSmartContractCallPresentation = (
  { address, amount, identifier }: IMultisigSmartContractCallPresentationProps) => {
  const { tokenPhotoJSX } = useTokenPhoto(identifier);

  return (
    <Box>
      <h4>
        <strong>Send Token</strong>
      </h4>
      <Box>
        <StyledTypography variant="subtitle1" sx={{ marginRight: '0.75rem', padding: '1rem 0' }}>
          {tokenPhotoJSX}
          <strong>{identifier}{' '}</strong>
        </StyledTypography>
      </Box>
      <Box>
        <StyledTypography
          sx={{
            color: 'rgb(93, 109, 116)',
            letterSpacing: 0.5,
            marginRight: '0.75rem',
          }}
          variant="subtitle1"
        >
          <strong className="mr-3">{i18next.t('Amount') as string}:</strong>
          {Number.isInteger(amount) ? operations.denominate({
            input: amount.toString(),
            denomination,
            decimals: 4,
            showLastNonZeroDecimal: true,
          }) : '0'}{' '}
        </StyledTypography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <StyledTypography variant="subtitle1" sx={{ marginRight: '0.75rem' }}>
          <strong>To: </strong>
        </StyledTypography>
        <MemberPresentationWithPhoto
          memberAddress={address}
          charactersLeftAfterTruncation={20}
        />
      </Box>
    </Box>
  );
};

export default MultisigSmartContractCallPresentation;
