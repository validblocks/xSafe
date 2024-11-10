import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { TokenPresentationProps } from 'src/components/Modals/Proposals/ProposeSendToken';
import { organizationTokenByIdentifierSelector } from 'src/redux/selectors/accountSelector';
import { Text } from '../StyledComponents/StyledComponents';
import { TokenPhoto } from './TokenPhoto';
import BigNumber from 'bignumber.js';

export const TOKEN_PRICE_PRECISION = 3;

type TokenPresentationConfig = {
  withPhoto: boolean;
  withTokenAmount: boolean;
  withTokenValue: boolean;
  withPrice: boolean;
  logoMarginRight?: string;
  logoWidth?: number;
  logoHeight?: number;
};

type TokenPresentationWithPriceProps = TokenPresentationProps &
  Partial<TokenPresentationConfig>;

const TokenPresentationWithPrice = ({
  identifier,
  withPhoto = true,
  withTokenAmount = true,
  withTokenValue = true,
  logoMarginRight = '0',
  logoWidth = 35,
  logoHeight = 35,
  withPrice = true,
}: TokenPresentationWithPriceProps) => {
  const { prettyIdentifier, tokenPrice, tokenValue, balanceLocaleString } =
    useSelector(organizationTokenByIdentifierSelector(identifier));

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {withPhoto && (
        <Box
          sx={{
            m: '0 .55rem 0 .3rem',
            '& svg, & img': {
              width: '35px',
              height: '35px',
              m: '0 !important',
            },
          }}
        >
          <TokenPhoto
            identifier={identifier}
            options={{ width: logoWidth, height: logoHeight, logoMarginRight }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Text>{prettyIdentifier}</Text>
        </Box>
        {withPrice && BigNumber.isBigNumber(tokenPrice) && (
          <Text fontSize={12}>
            $
            {tokenPrice?.toNumber().toLocaleString('EN', {
              maximumSignificantDigits: 21,
            })}
          </Text>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
          textAlign: 'right',
        }}
      >
        {withTokenAmount && (
          <Box>
            <Text>{balanceLocaleString}</Text>
          </Box>
        )}
        {withTokenValue && BigNumber.isBigNumber(tokenValue) && (
          <Box>
            <Text fontSize={12}>${tokenValue.toNumber()}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TokenPresentationWithPrice;
