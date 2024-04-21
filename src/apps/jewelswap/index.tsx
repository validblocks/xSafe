import { Box, useMediaQuery } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { useOrganizationInfoContext } from 'src/components/Providers/OrganizationInfoContextProvider';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import { jewelSwapLendingContractAddress } from 'src/config';
import { useSelector } from 'react-redux';
import MultiversXWithStroke from 'src/assets/img/MultiversXWithStroke.svg';
import BigJewelSwapMobile from 'src/assets/img/BigJewelSwapMobile.svg';
import BigJewelSwapDesktop from 'src/assets/img/BigJewelSwapDesktop.svg';
import {
  ImageText,
  NFTMarketplaceCard,
  NFTMarketplaceDescription,
  NFTMarketplaceImgContainer,
} from 'src/apps/nft-auctions/styled';
import { organizationTokenByIdentifierSelector } from 'src/redux/selectors/accountSelector';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import BalanceDisplay from 'src/components/Utils/BalanceDisplay';
import { StateType } from '@multiversx/sdk-dapp/reduxStore/slices';
import { OrganizationToken } from 'src/types/organization';
import { ExternalContractFunction } from 'src/types/multisig/ExternalContractFunction';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import useAmountInputController from 'src/hooks/useAmountInputController';

const initialFormAmount = '0';

const LendInJewelSwap = () => {
  const { handleAmountInputChange, amount } =
    useAmountInputController(initialFormAmount);
  const [isLendButtonEnabled, setIsLendButtonEnabled] = useState(true);

  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const { tokenValue, balanceLocaleString } = useSelector<
    StateType,
    OrganizationToken
  >(organizationTokenByIdentifierSelector('EGLD'));

  const handleLendButtonClick = useCallback(async () => {
    try {
      await mutateSmartContractCall(
        new Address(jewelSwapLendingContractAddress),
        new BigUIntValue(
          new BigNumber(Number(amount.replaceAll(',', '')))
            .shiftedBy(18)
            .decimalPlaces(0, BigNumber.ROUND_FLOOR),
        ),
        ExternalContractFunction.LEND_IN_JEWELSWAP,
      );
    } catch (e) {
      console.error({ e });
    }
  }, [amount]);

  const disableLendButton = useCallback(() => {
    setIsLendButtonEnabled(false);
  }, []);

  const enableLendButton = useCallback(() => {
    setIsLendButtonEnabled(true);
  }, []);

  return (
    <Box pb={'70px'}>
      {maxWidth600 && (
        <Box pb={2}>
          <img src={BigJewelSwapMobile} width={'100%'} />
        </Box>
      )}
      <Box display="flex" gap={maxWidth600 ? 0 : '50px'} alignContent="stretch">
        <Box display="flex" sx={{ width: maxWidth600 ? '100%' : 'auto ' }}>
          <NFTMarketplaceCard
            sx={{
              maxWidth: maxWidth600 ? '100%' : '380px',
              minWidth: maxWidth600 ? '100%' : '380px !important',
            }}
          >
            <NFTMarketplaceImgContainer py={2} minHeight="auto !important">
              <Box>
                <ImageText textAlign="center" fontSize={12}>
                  TOTAL BALANCE
                </ImageText>
              </Box>
              <Box
                pt={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box>
                  <img src={MultiversXWithStroke} alt="MultiversX" />
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box pl={1}>
                    <BalanceDisplay number={balanceLocaleString} />
                  </Box>
                  <Box pl={1} fontSize={18}>
                    $EGLD
                  </Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box>$</Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box pl={0.25}>
                    <BalanceDisplay
                      bigFontSize={16}
                      smallFontSize={12}
                      number={tokenValue
                        .toLocaleString('EN')
                        .replaceAll(',', '')}
                    />
                  </Box>
                  <Box pl={0.5} fontSize={12}>
                    USD
                  </Box>
                </Box>
              </Box>
            </NFTMarketplaceImgContainer>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
              <Box>
                <Box display="flex" py={1.5}>
                  <Box>
                    <Text fontSize="1.5rem" fontWeight={700}>
                      Start lending with JewelSwap
                    </Text>
                  </Box>
                </Box>
                <Box pb={2}>
                  <NFTMarketplaceDescription>
                    Discover the unparalleled opportunity to engage in direct
                    lending with JewelSwap. Withdraw and Compound will be
                    accessible solely upon the completion of each epoch. We
                    kindly urge you to visit jewelswap.io to stay informed on
                    the epoch's conclusion and its subsequent implications.
                  </NFTMarketplaceDescription>
                </Box>
              </Box>
              <Box mt={1}>
                <Box>
                  <AmountInputWithTokenSelection
                    onAmountIsNaN={disableLendButton}
                    onAmountIsZero={disableLendButton}
                    onAmountIsBiggerThanBalance={disableLendButton}
                    onAmountIsLessThanAllowed={disableLendButton}
                    onSuccessfulAmountValidation={enableLendButton}
                    onInputChange={handleAmountInputChange}
                    config={{
                      withTokenSelection: false,
                      withAvailableAmount: true,
                      isEsdtOrEgldRelated: true,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    paddingTop: '1rem',
                  }}
                >
                  <MainButton
                    onClick={handleLendButtonClick}
                    disabled={!isLendButtonEnabled || isInReadOnlyMode}
                    fullWidth
                  >
                    Propose Lending
                  </MainButton>
                </Box>
              </Box>
            </Box>
          </NFTMarketplaceCard>
        </Box>
        <Box display="flex" alignItems="center">
          {!maxWidth600 && (
            <Box marginTop="50px">
              <img src={BigJewelSwapDesktop} height={400} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LendInJewelSwap;
