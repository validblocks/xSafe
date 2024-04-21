import { Box } from '@mui/material';
import { OrganizationToken } from 'src/types/organization';
import { useSelector } from 'react-redux';
import { TokenPresentationProps } from 'src/components/Modals/Proposals/ProposeSendToken';
import { organizationTokenByIdentifierSelector } from 'src/redux/selectors/accountSelector';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { Text } from '../StyledComponents/StyledComponents';
import { TokenPhoto } from './TokenPhoto';

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
    useSelector<StateType, OrganizationToken>(
      organizationTokenByIdentifierSelector(identifier),
    );

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
        {withPrice && <Text fontSize={12}>${tokenPrice}</Text>}
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
        {withTokenValue && (
          <Box>
            <Text fontSize={12}>${tokenValue}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TokenPresentationWithPrice;
