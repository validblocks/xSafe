import { operations } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { withStyles } from '@mui/styles';
import i18next from 'i18next';
import { denomination } from 'src/config';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';
import BigNumber from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import TokenPresentationWithPrice from 'src/components/Utils/TokenPresentationWithPrice';

const StyledTypography = withStyles({
  root: {
    letterSpacing: 0.5,
  },
})(Typography);

interface ISendTokenProposalPresentationProps {
  address: Address;
  amount: BigNumber;
  identifier: string;
  title: string;
}

const SendTokenProposalPresentation = (
  { address, amount, identifier, title }: ISendTokenProposalPresentationProps) => {
  const width600px = useMediaQuery('@media(max-width:600px)');
  const width500px = useMediaQuery('@media(max-width:500px)');
  return (
    <Box>
      <h4 style={{ fontSize: width600px ? 17 : '1.5rem' }}>
        <strong>{title}</strong>
      </h4>
      <Box sx={{ py: '1rem' }}>
        <TokenPresentationWithPrice identifier={identifier} withTokenAmount={false} withTokenValue={false} />
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
          {operations.denominate({
            input: amount.toString(10) ?? '0',
            denomination,
            decimals: 4,
            showLastNonZeroDecimal: true,
          }) ?? '0'}{' '}
        </StyledTypography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <StyledTypography variant="subtitle1" sx={{ marginRight: '0.75rem' }}>
          <strong>To: </strong>
        </StyledTypography>
        <MemberPresentationWithPhoto
          memberAddress={address}
          // eslint-disable-next-line no-nested-ternary
          charactersLeftAfterTruncation={width500px ? 8 : width600px ? 16 : 20}
        />
      </Box>
    </Box>
  );
};

export default SendTokenProposalPresentation;
