/* eslint-disable @typescript-eslint/no-unused-vars */
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { useDispatch, useSelector } from 'react-redux';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { Address, BigUIntValue, TokenPayment } from '@elrondnetwork/erdjs/out';
import BigNumber from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import { ProposalsTypes } from 'src/types/Proposals';
import { useCallback, useMemo } from 'react';
import {
  setProposeMultiselectSelectedOption,
  setSelectedStakingProvider,
} from 'src/redux/slices/modalsSlice';
import * as StyledRemote from '../../pages/Organization/styled';
import * as Styled from './styled';
import { Text } from '../StyledComponents/StyledComponents';
import { AssetActionButton } from '../Theme/StyledComponents';
import ProviderPresentation from '../Staking/ProviderPresentation';
import ElrondLogo from '../Utils/ElrondLogo';

export const SQUARE_IMAGE_WIDTH = 30;
export const SQUARE_SMALL_IMAGE_WIDTH = 20;

const DelegationMobileCards = ({ items, actionButton }:
    { items: any, actionButton: JSX.Element[] }) => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const dispatch = useDispatch();
  const handleOptionSelected = useCallback((
    option: ProposalsTypes,
  ) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
  }, [dispatch]);
  const minWidth480 = useMediaQuery('(min-width: 480px)');
  const style = useMemo(() => {
    if (!minWidth480) {
      return {
        p: '15px 10px',
      };
    }
    return {
      p: '0px 10px',
    };
  }, [minWidth480]);
  return (
    items.map((item: any) => (
      <Styled.DelegationCardContainer
        key={item.identity}
      >
        <Styled.DelegationInfoContainer>
          <Styled.DelegationInfoBox
            sx={style}
          >
            <ProviderPresentation provider={item} />
          </Styled.DelegationInfoBox>
          <Styled.DelegationInfoBox>
            <Text>Delegated</Text>
            <Text display="flex" alignItems="center">
              <ElrondLogo width={15} height={15} marginRight={1} />
              {Number(item?.delegatedColumn?.delegatedAmount).toLocaleString()} $EGLD
            </Text>
          </Styled.DelegationInfoBox>
          <Styled.DelegationInfoBox>
            <Text>Rewards</Text>
            <Text display="flex" alignItems="center">
              <ElrondLogo width={15} height={15} marginRight={1} />
              {Number(item?.claimableRewardsColumn?.claimableRewards).toLocaleString()} $EGLD
            </Text>
          </Styled.DelegationInfoBox>
        </Styled.DelegationInfoContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <Styled.ActionButtonBox>
            <AssetActionButton
              key="0"
              sx={{ opacity: '1 !important', width: '100%' }}
              onClick={() => {
                mutateSmartContractCall(
                  new Address(item.provider),
                  new BigUIntValue(new BigNumber(0)),
                  'reDelegateRewards');
              }}
            >
              <AssetActionIcon width="30px" height="30px" /> Restake
            </AssetActionButton>
          </Styled.ActionButtonBox>
          <Styled.ActionButtonBox>
            <AssetActionButton
              sx={{ opacity: '1 !important', width: '100%' }}
              key="2"
              onClick={() => {
                mutateSmartContractCall(
                  new Address(item.provider),
                  new BigUIntValue(new BigNumber(0)),
                  'claimRewards',
                );
              }}
            >
              <AssetActionIcon width="30px" height="30px" transform="rotate(180)" /> Claim
            </AssetActionButton>
          </Styled.ActionButtonBox>
          <Styled.ActionButtonBox>
            <AssetActionButton
              sx={{ opacity: '1 !important', width: '100%' }}
              key="3"
              onClick={() => {
                handleOptionSelected(ProposalsTypes.unstake_tokens);
                dispatch(setSelectedStakingProvider(item));
              }}
            >
              <AssetActionIcon width="30px" height="30px" transform="rotate(180)" /> Unstake
            </AssetActionButton>
          </Styled.ActionButtonBox>
        </Box>
      </Styled.DelegationCardContainer>
    ))
  );
};

export default DelegationMobileCards;
