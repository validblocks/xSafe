import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import Form from 'react-bootstrap/Form';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { FormikProps, useFormik } from 'formik';
import { denomination } from 'src/config';
import { TestContext } from 'yup';
import * as Yup from 'yup';
import { multisigBalanceSelector, organizationTokensSelector } from 'src/redux/selectors/accountSelector';
import { OrganizationToken } from 'src/pages/Organization/types';
import ProviderPresentation from './ProviderPresentation';
import { useMultistepFormContext } from '../Utils/MultistepForm';
import { ChangeStepButton } from '../Theme/StyledComponents';

interface IFormValues {
  amount: string;
}

const StakingFormStepTwo = () => {
  const selectedProviderIdentifier = useSelector(selectedStakingProviderSelector);

  const {
    fetchedProviderIdentities,
  } = useProviderIdentitiesAfterSelection();

  const selectedProvider = useMemo(
    () => fetchedProviderIdentities
      ?.find((provider) => provider.identity === selectedProviderIdentifier),
    [fetchedProviderIdentities, selectedProviderIdentifier],
  );

  const { t } = useTranslation();

  let formik: FormikProps<IFormValues>;
  const multisigBalance = useSelector(multisigBalanceSelector) as Balance;
  console.log({ BALANCE: multisigBalance.toString() });
  const {
    proceedToPreviousStep,
  } = useMultistepFormContext();

  const denominatedValue = useMemo(
    () =>
      operations.denominate({
        input: '100000000',
        denomination,
        decimals: 4,
        showLastNonZeroDecimal: true,
      }),
    [multisigBalance],
  );
  function validateRecipient(value?: string) {
    try {
      const _address = new Address(value);
      return true;
    } catch (err) {
      return false;
    }
  }
  const organizationTokens = useSelector(organizationTokensSelector);
  console.log({ organizationTokens });
  const egldBalance = organizationTokens.find((token: OrganizationToken) => token.identifier === 'EGLD');
  console.log({ egldBalance });

  function validateAmount(value?: string, testContext?: TestContext) {
    if (value == null) {
      return true;
    }
    const newAmount = Number(value);
    if (Number.isNaN(newAmount)) {
      return (
        testContext?.createError({
          message: 'Invalid amount',
        }) ?? false
      );
    }
    if (newAmount < 0) {
      formik.setFieldValue('amount', 0);
    }
    if (newAmount > Number(0)) {
      return (
        testContext?.createError({
          message:
            'There are not enough money in the organization for this transaction',
        }) ?? false
      );
    }
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

  return (
    <Box sx={{ padding: '2rem 3rem' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        justifyContent: 'center',
        gap: 3,
        background: 'rgba(76, 47, 252, 0.1)',
        borderRadius: '10px' }}
      >
        <Box sx={{ flex: 4 }}>
          <ProviderPresentation provider={selectedProvider} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ChangeStepButton onClick={proceedToPreviousStep}>
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
          <span>{`Balance: ${denominatedValue} EGLD`}</span>
        </div>
      </Box>
    </Box>
  );
};
export default StakingFormStepTwo;
