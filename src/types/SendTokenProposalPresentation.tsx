import { Address, TokenPayment } from '@elrondnetwork/erdjs/out';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { withStyles } from '@mui/styles';
import i18next from 'i18next';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';
import BigNumber from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import TokenPresentationWithPrice from 'src/components/Utils/TokenPresentationWithPrice';
import { Text } from 'src/components/StyledComponents/StyledComponents';

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
  const maxWidth600 = useMediaQuery('@media(max-width:600px)');
  const maxWidth500 = useMediaQuery('@media(max-width:500px)');
  return (
    <Box>
      <Text style={{ fontSize: maxWidth600 ? 17 : '1.5rem' }}>
        <strong>{title}</strong>
      </Text>
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
        >
          <strong className="mr-3">{i18next.t('Amount') as string}:</strong>
          {Number(TokenPayment.egldFromBigInteger(amount).toRationalNumber()).toLocaleString() ?? '0'}{' '}
        </StyledTypography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <StyledTypography sx={{ marginRight: '0.75rem' }}>
          <strong>To: </strong>
        </StyledTypography>
        <MemberPresentationWithPhoto
          memberAddress={address}
          // eslint-disable-next-line no-nested-ternary
          charactersLeftAfterTruncation={maxWidth500 ? 8 : maxWidth600 ? 16 : 20}
        />
      </Box>
    </Box>
  );
};

export default SendTokenProposalPresentation;
