import * as Yup from 'yup';
import { Box, useMediaQuery } from '@mui/material';
import BigNumber from '@multiversx/sdk-core/node_modules/bignumber.js';
import { useCallback, useState } from 'react';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
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
import {
  multisigBalanceSelector,
  organizationTokenByIdentifierSelector,
} from 'src/redux/selectors/accountSelector';
import RationalNumber from 'src/utils/RationalNumber';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import { FormikProps, useFormik } from 'formik';
import { TestContext } from 'yup';
import { useTranslation } from 'react-i18next';
import BalanceDisplay from 'src/components/Utils/BalanceDisplay';
import { StateType } from '@multiversx/sdk-dapp/reduxStore/slices';
import { OrganizationToken } from 'src/pages/Organization/types';

interface IFormValues {
  amount: string;
}

const LendInJewelSwap = () => {
  const { t } = useTranslation();
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const [isLendButtonEnabled, setIsLendButtonEnabled] = useState(true);

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      amount: '0',
    },
    onSubmit: () => Promise.resolve(null),
    validationSchema: Yup.object().shape({
      amount: Yup.string()
        .required('Required')
        .transform((value) => value.replace(',', ''))
        .test((value?: string, testContext?: TestContext) => {
          const newAmount = Number(value);
          if (Number.isNaN(newAmount)) {
            setIsLendButtonEnabled(false);
            return (
              testContext?.createError({
                message: 'Invalid amount',
              }) ?? false
            );
          }
          if (newAmount < 0) {
            formik.setFieldValue('amount', 0);
          }
          if (newAmount === 0) {
            setIsLendButtonEnabled(false);
          }
          if (newAmount > Number(numberTokenAmount)) {
            setIsLendButtonEnabled(false);
            return (
              testContext?.createError({
                message: t('Insufficient funds'),
              }) ?? false
            );
          }

          setIsLendButtonEnabled(true);
          return true;
        }),
    }),
    validateOnChange: false,
    validateOnMount: true,
  });

  const { touched, errors, values } = formik;
  const { amount } = values;

  const amountError = touched.amount && errors.amount;

  const handleLendButtonClick = useCallback(() => {
    console.log({ amount });
    try {
      mutateSmartContractCall(
        new Address(jewelSwapLendingContractAddress),
        new BigUIntValue(
          new BigNumber(Number(amount.replaceAll(',', '')))
            .shiftedBy(18)
            .decimalPlaces(0, BigNumber.ROUND_FLOOR),
        ),
        'lendEgld',
      );
    } catch (e) {
      console.log({ e });
    }
  }, [amount, mutateSmartContractCall]);

  const handleBlur = useCallback(
    (e: any) => formik.handleBlur(e),
    [formik.handleBlur],
  );

  const { tokenValue, tokenAmount } = useSelector<StateType, OrganizationToken>(
    organizationTokenByIdentifierSelector('EGLD'),
  );

  const numberTokenAmount = Number(tokenAmount.replaceAll(',', ''));

  console.log({ numberTokenAmount });

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
                    <BalanceDisplay number={tokenAmount} />
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
                      number={tokenValue.toLocaleString().replaceAll(',', '')}
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
                    amount={amount}
                    amountError={amountError}
                    formik={formik}
                    handleInputBlur={handleBlur}
                    handleInputChange={formik.handleChange}
                    resetAmount={() => formik.setFieldValue('amount', 0)}
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
