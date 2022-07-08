/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TokenPresentationProps } from 'src/pages/MultisigDetails/ProposeMultiselectModal/ProposeSendToken';
import { TokenTableRowItem } from 'src/pages/Organization/types';
import { organizationTokenByIdentifierSelector, tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import useTokenPhoto from 'src/utils/useTokenPhoto';

type TokenPresentationConfig = {
    withPhoto: boolean;
    withTokenAmount: boolean;
    withTokenValue: boolean;
    withPrice: boolean;
};

type TokenPresentationWithPriceProps = TokenPresentationProps & Partial<TokenPresentationConfig>;

const TokenPresentationWithPrice = ({
  identifier,
  withPhoto = true,
  withTokenAmount = true,
  withTokenValue = true,
  withPrice = true }: TokenPresentationWithPriceProps) => {
  const { tokenPhotoJSX } = useTokenPhoto(identifier);

  const tokenSelectorFunction = useSelector(organizationTokenByIdentifierSelector);

  const tokenForPresentation = useMemo(() => tokenSelectorFunction(identifier), [identifier, tokenSelectorFunction]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {withPhoto && (
        <Box>
          {tokenPhotoJSX}
        </Box>
        )}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        >
          <Box>
            {tokenForPresentation?.prettyIdentifier}
          </Box>
          {withPrice && (
          <Typography variant="subtitle2">
            {tokenForPresentation?.tokenPrice}
          </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        {withTokenAmount && (
        <Box>
          {tokenForPresentation?.tokenAmount}
        </Box>
        )}
        {withTokenValue && (
        <Box>
          {tokenForPresentation?.tokenValue}
        </Box>
        )}
      </Box>
    </Box>
  );
};

export default TokenPresentationWithPrice;
