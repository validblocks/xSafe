import { Box } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import Form from 'react-bootstrap/Form';
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

interface IFormValues {
  amount: string;
}

const WithdrawFormStepTwo = () => {
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
    .find((token: OrganizationToken) => token.identifier === 'EGLD').tokenAmount.replaceAll(',', '') ?? 0;

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
    if (newAmount < 0) {
      formik.setFieldValue('amount', 0);
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
      amount: 0,
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
      //   const addressParam = new Address(formik.values.receiver);
      const addressParam = new Address('erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzhllllsp9wvyl');

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
  }, [formik.values.amount, setBuiltFinalActionHandler]);

  useLayoutEffect(() => {
    setButtonWidth(buttonRef?.current?.offsetWidth);
  }, [buttonRef.current]);

  const buttonStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '0 14px',
    justifyContent: 'center',
    gap: buttonWidth > 90 ? 0 : 3,
    background: 'rgba(76, 47, 252, 0.1)',
    paddingBottom: buttonWidth > 90 ? '10px' : '0 !important',
    borderRadius: '10px',
  }), [buttonWidth]);

  return (
    <Box sx={{ padding: '2rem 3rem 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={buttonStyle}>
        <Box sx={{ flex: 4 }}>
          <ProviderPresentation provider={selectedProvider} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ChangeStepButton ref={buttonRef} onClick={proceedToPreviousStep}>
            {t('Change') as string}
          </ChangeStepButton>
        </Box>
      </Box>
      <Box>
        <div className="modal-control-container">
          <label htmlFor={amount}>{t('Amount') as string}</label>
          <div className="input-wrapper">
            <Form.Control
              id={amount}
              name="amount"
              isInvalid={amountError != null}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={amount}
            />

            {amountError != null && (
              <Form.Control.Feedback type="invalid">
                {amountError}
              </Form.Control.Feedback>
            )}
          </div>
          <span className="mb-0">{`${t('Available')}: ${egldBalanceString} EGLD`}</span>
        </div>
      </Box>
    </Box>
  );
};
export default WithdrawFormStepTwo;
