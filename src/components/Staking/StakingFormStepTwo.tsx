import { Box } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { Address, Balance, BigUIntValue } from '@elrondnetwork/erdjs/out';
import { FormikProps, useFormik } from 'formik';
import { TestContext } from 'yup';
import * as Yup from 'yup';
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
import { OrganizationToken } from 'src/pages/Organization/types';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import ProviderPresentation from './ProviderPresentation';
import { useMultistepFormContext } from '../Utils/MultistepForm';
import { ChangeStepButton } from '../Theme/StyledComponents';
import InputTokenPresentation from '../Utils/InputTokenPresentation';

interface IFormValues {
  amount: string;
}

const StakingFormStepTwo = () => {
  const { t } = useTranslation();
  const selectedProviderIdentifier = useSelector(selectedStakingProviderSelector);
  const { setIsFinalStepButtonActive, setBuiltFinalActionHandler } = useMultistepFormContext();

  const {
    fetchedProviderIdentities,
  } = useProviderIdentitiesAfterSelection();

  const selectedProvider = useMemo(
    () => fetchedProviderIdentities
      ?.find((provider) => provider.identity === selectedProviderIdentifier),
    [fetchedProviderIdentities, selectedProviderIdentifier],
  );

  let formik: FormikProps<IFormValues>;
  const {
    proceedToPreviousStep,
  } = useMultistepFormContext();

  const organizationTokens = useSelector(organizationTokensSelector);
  const egldBalanceString = organizationTokens
    ?.find((token: OrganizationToken) => token.identifier === 'EGLD').tokenAmount.replaceAll(',', '') ?? 0;

  function validateRecipient(value?: string) {
    try {
      const _address = new Address(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  const egldBalanceNumber = Number(egldBalanceString);

  function validateAmount(value?: string, testContext?: TestContext) {
    if (value == null) {
      return true;
    }
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
          message:
                        t('Insufficient funds'),
        }) ?? false
      );
    }

    setIsFinalStepButtonActive(true);
    return true;
  }

  const validationSchema = Yup.object().shape({
    receiver: Yup.string()
      .min(2, 'Too Short!')
      .max(500, 'Too Long!')
      .required('Required')
      .test(validateRecipient),
    amount: Yup.string()
      .required('Required')
      .transform((value) => value.replace(',', '.'))
      .test(validateAmount),
    data: Yup.string(),
  });

  formik = useFormik({
    initialValues: {
      amount: 1,
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { touched, errors, values } = formik;
  const { amount } = values;

  const amountError = touched.amount && errors.amount;

  const buttonRef = useRef<any>(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    try {
      const addressParam = new Address(selectedProvider?.provider);

      const amountNumeric = Number(formik.values.amount);
      if (Number.isNaN(amountNumeric)) {
        return;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );

      setBuiltFinalActionHandler(() => () => {
        mutateSmartContractCall(addressParam, amountParam, 'delegate');
      });
    } catch (err) {
      console.error(err);
    }
  }, [formik.values.amount, selectedProvider?.provider, setBuiltFinalActionHandler]);

  useLayoutEffect(() => {
    setButtonWidth(buttonRef?.current?.offsetWidth);
  }, []);

  const buttonStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '0 14px',
    justifyContent: 'center',
    gap: buttonWidth > 90 ? 0 : 3,
    background: 'rgba(76, 47, 252, 0.1)',
    paddingBottom: buttonWidth > 90 ? '9px' : '0 !important',
    borderRadius: '10px',
  }), [buttonWidth]);

  console.log('amount', amount);

  return (
    <Box sx={{ padding: '2rem 3rem 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={buttonStyle}>
        <Box sx={{ flex: 4 }}>
          <ProviderPresentation provider={selectedProvider} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <ChangeStepButton ref={buttonRef} onClick={proceedToPreviousStep}>
            {t('Change') as string}
          </ChangeStepButton>
        </Box>
      </Box>
      <Box sx={{ mb: '.35rem !important' }}>
        <InputTokenPresentation
          amount={amount}
          amountError={amountError}
          egldBalanceString={egldBalanceString}
          label={`${t('Amount')}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formik={formik}
        />
      </Box>
    </Box>
  );
};
export default StakingFormStepTwo;
