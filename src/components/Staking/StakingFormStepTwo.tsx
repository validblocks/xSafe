import { Box, useMediaQuery } from '@mui/material';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { Address, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { FormikProps, useFormik } from 'formik';
import { TestContext } from 'yup';
import * as Yup from 'yup';
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
import { OrganizationToken } from 'src/pages/Organization/types';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { currentMultisigTransactionIdSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import ProviderPresentation from './ProviderPresentation';
import { useMultistepFormContext } from '../Utils/MultistepForm';
import {
  ChangeStepButton,
  FinalStepActionButton,
} from '../Theme/StyledComponents';
import { Text } from '../StyledComponents/StyledComponents';
import AmountInputWithTokenSelection from '../Utils/AmountInputWithTokenSelection';

interface IFormValues {
  amount: string;
}

const StakingFormStepTwo = () => {
  const { t } = useTranslation();
  const selectedProviderIdentifier = useSelector(
    selectedStakingProviderSelector,
  );
  const { setIsFinalStepButtonActive, setBuiltFinalActionHandler } =
    useMultistepFormContext();

  const { fetchedProviderIdentities } = useProviderIdentitiesAfterSelection();

  const selectedProvider = useMemo(
    () =>
      fetchedProviderIdentities?.find(
        (provider) => provider.identity === selectedProviderIdentifier,
      ),
    [fetchedProviderIdentities, selectedProviderIdentifier],
  );

  const { proceedToPreviousStep } = useMultistepFormContext();

  const organizationTokens = useSelector(organizationTokensSelector);
  const egldBalanceString =
    organizationTokens
      ?.find((token: OrganizationToken) => token.identifier === 'EGLD')
      .tokenAmount.replaceAll(',', '') ?? 0;

  const egldBalanceNumber = Number(egldBalanceString);

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      amount: 1,
    },
    validationSchema: Yup.object().shape({
      receiver: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Required')
        .test((value?: string) => {
          try {
            new Address(value);
            return true;
          } catch (err) {
            return false;
          }
        }),
      amount: Yup.string()
        .required('Required')
        .transform((value) => value.replace(',', ''))
        .test((value?: string, testContext?: TestContext) => {
          const newAmount = Number(value);
          if (Number.isNaN(newAmount)) {
            setIsFinalStepButtonActive(false);
            return (
              testContext?.createError({
                message: 'Invalid amount',
              }) ?? false
            );
          }
          if (newAmount < 1) {
            formik.setFieldValue('amount', 1);
          }
          if (newAmount === 0) {
            setIsFinalStepButtonActive(false);
          }
          if (newAmount > Number(egldBalanceNumber)) {
            setIsFinalStepButtonActive(false);
            return (
              testContext?.createError({
                message: t('Insufficient funds'),
              }) ?? false
            );
          }

          setIsFinalStepButtonActive(true);
          return true;
        }),
      data: Yup.string(),
    }),
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { touched, errors, values } = formik;
  const { amount } = values;

  const amountError = touched.amount && errors.amount;

  const buttonRef = useRef<any>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

  useEffect(() => {
    try {
      const addressParam = new Address(selectedProvider?.provider);

      const inputAmount = formik.values.amount.toString().replaceAll(',', '');
      const amountNumeric = Number(inputAmount);
      if (Number.isNaN(amountNumeric)) {
        return;
      }

      const amountParam = new BigUIntValue(
        TokenTransfer.egldFromAmount(amountNumeric).valueOf(),
      );

      setBuiltFinalActionHandler(() => () => {
        mutateSmartContractCall(addressParam, amountParam, 'delegate');
      });
    } catch (err) {
      console.error(err);
    }
  }, [
    formik.values.amount,
    selectedProvider?.provider,
    setBuiltFinalActionHandler,
  ]);

  useLayoutEffect(() => {
    setButtonWidth(buttonRef?.current?.offsetWidth);
  }, []);

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(setProposeMultiselectSelectedOption(null));
  };

  const proposeStake = useCallback(() => {
    setIsProcessingTransaction(true);
    const addressParam = new Address(selectedProvider?.provider);

    const formikAmount = formik.values.amount.toString();
    const inputAmount = formikAmount.replaceAll(',', '');
    const amountNumeric = Number(inputAmount);
    if (Number.isNaN(amountNumeric)) {
      return;
    }

    const amountParam = new BigUIntValue(
      TokenTransfer.egldFromAmount(amountNumeric).valueOf(),
    );

    mutateSmartContractCall(addressParam, amountParam, 'delegate');
    closeModal();
  }, [formik.values.amount, selectedProvider?.provider]);

  const transactionId = useSelector(currentMultisigTransactionIdSelector);
  useTrackTransactionStatus({
    transactionId,
    onSuccess: () => {
      setIsProcessingTransaction(false);
    },
    onCancelled: () => {
      setIsProcessingTransaction(false);
    },
    onTimedOut: () => {
      setIsProcessingTransaction(false);
    },
    onFail: () => {
      setIsProcessingTransaction(false);
    },
  });

  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const maxWidth480 = useMediaQuery('(max-width:480px)');

  const buttonStyle = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: buttonWidth > 90 ? 0 : 3,
      background: 'rgba(76, 47, 252, 0.1)',
      padding: maxWidth480 ? '1rem' : '0 1rem 1rem',
      borderRadius: '10px',
    }),
    [buttonWidth, maxWidth480],
  );

  return (
    <Box
      sx={{
        padding: maxWidth600 ? '16px' : '2rem 3rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={buttonStyle}>
        <Box sx={{ flex: 4 }}>
          <ProviderPresentation provider={selectedProvider} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <ChangeStepButton
            disabled={isProcessingTransaction}
            ref={buttonRef}
            onClick={proceedToPreviousStep}
            sx={{ marginTop: maxWidth480 ? '1rem' : 0 }}
          >
            {t('Change') as string}
          </ChangeStepButton>
        </Box>
      </Box>
      <AmountInputWithTokenSelection
        amount={amount}
        amountError={amountError}
        formik={formik}
        handleInputBlur={formik.handleBlur}
        handleInputChange={formik.handleChange}
        resetAmount={() => formik.setFieldValue('amount', 0)}
        config={{ withTokenSelection: false, withAvailableAmount: true }}
      />
      <Box display={'flex'} gap={2} paddingBottom={maxWidth600 ? '4px' : 4}>
        <ChangeStepButton
          disabled={isProcessingTransaction}
          onClick={proceedToPreviousStep}
        >
          <Text>{t('Back') as string}</Text>
        </ChangeStepButton>
        <FinalStepActionButton
          disabled={
            !!amountError || !selectedProvider || isProcessingTransaction
          }
          onClick={proposeStake}
        >
          <Text>Propose</Text>
        </FinalStepActionButton>
      </Box>
    </Box>
  );
};
export default StakingFormStepTwo;
