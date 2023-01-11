/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from '@mui/material';
import { OrganizationToken } from 'src/pages/Organization/types';
import { useSelector } from 'react-redux';
import { TokenPresentationProps } from 'src/pages/MultisigDetails/ProposeMultiselectModal/ProposeSendToken';
import {
  getTokenPhotoById,
  accountSelector } from 'src/redux/selectors/accountSelector';
import useTokenPhoto from 'src/utils/useTokenPhoto';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { useMemo } from 'react';
import { Text } from '../StyledComponents/StyledComponents';
import { TokenPhoto } from './TokenPhoto';

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

  const selector = useMemo(
    () => createDeepEqualSelector(accountSelector, (state: StateType) => getTokenPhotoById(state, identifier)),
    [identifier]);

  const {
    prettyIdentifier,
    tokenPrice,
    tokenValue,
    tokenAmount,
  } = useSelector<StateType, OrganizationToken>(selector);

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    }}
    >
      {withPhoto && (
      <Box
        sx={{
          m: '0 .55rem 0 .3rem',
          '& svg, & img': { width: '35px', height: '35px', m: '0 !important' },
        }}
      >
        <TokenPhoto identifier={identifier} options={{ width: 20 }} />
      </Box>
      )}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      >
        <Box>
          <Text>{prettyIdentifier}</Text>
        </Box>
        {withPrice && (
        <Text fontSize={12}>
          ${tokenPrice}
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
          <Text>{tokenAmount}</Text>
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
