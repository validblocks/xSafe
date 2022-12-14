import { useEffect, useMemo } from 'react';
import { Address, BigUIntValue } from '@elrondnetwork/erdjs/out';
import { FormikProps, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { TestContext } from 'yup';
import { useTheme } from 'styled-components';
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
import { FormikInputField } from 'src/helpers/formikFields';
import { MultisigSendEgld } from 'src/types/MultisigSendEgld';
import { OrganizationToken } from 'src/pages/Organization/types';
import { Box, TextField } from '@mui/material';
import InputTokenPresentation from 'src/components/Utils/InputTokenPresentation';

interface ProposeSendEgldType {
  handleChange: (proposal: MultisigSendEgld) => void;
  setSubmitDisabled: (value: boolean) => void;
}

interface IFormValues {
  receiver: string;
  amount: string;
  data: string
}

const ProposeSendEgld = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendEgldType) => {
  let formik: FormikProps<IFormValues>;

  const { t }: { t: any } = useTranslation();

  const theme: any = useTheme();
  const organizationTokens = useSelector(organizationTokensSelector);
  const egldBalanceString = organizationTokens
    ?.find((token: OrganizationToken) => token.identifier === 'EGLD').tokenAmount.replaceAll(',', '') ?? 0;

  const egldBalance =
  useMemo(() => parseFloat(egldBalanceString.replaceAll(',', '')), [egldBalanceString]);

  useEffect(() => {
    setSubmitDisabled(true);
  }, []);

  function validateRecipient(value?: string) {
    try {
      const _address = new Address(value);
      return true;
    } catch (err) {
      return false;
    }
  }

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
    if (newAmount === 0) {
      return (
        testContext?.createError({
          message:
          'The amount should be greater than 0',
        }) ?? false
      );
    }
    if (newAmount > Number(egldBalance)) {
      return (
        testContext?.createError({
          message:
            'There is not enough money in the organization for this transaction',
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
      receiver: '',
      amount: 1,
      data: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { touched, errors, values } = formik;
  const { amount, receiver, data } = values;
  const getProposal = (): MultisigSendEgld | null => {
    try {
      const addressParam = new Address(formik.values.receiver);

      const amountNumeric = Number(formik.values.amount);
      if (Number.isNaN(amountNumeric)) {
        return null;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );

      return new MultisigSendEgld(addressParam, amountParam, data);
    } catch (err) {
      return null;
    }
  };

  function refreshProposal() {
    if (Object.keys(formik.errors).length > 0) {
      return;
    }
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  }

  useEffect(() => {
    refreshProposal();
  }, [formik.values, formik.errors]);

  useEffect(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [formik.errors, setSubmitDisabled]);

  const receiverError = touched.receiver && errors.receiver;
  const amountError = touched.amount && errors.amount;

  return (
    <Box sx={{ p: '1.93rem 2.5rem .3rem' }}>
      <FormikInputField
        label={t('Send to')}
        name="receiver"
        value={receiver}
        error={receiverError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={receiverError != null ? 'isError' : ''}
      />
      <InputTokenPresentation
        amount={amount}
        amountError={amountError}
        egldBalanceString={egldBalanceString}
        label={`${t('Amount')}`}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        formik={formik}
      />
      <Box>
        <TextField
          variant="outlined"
          label={t('Data (optional)')}
          id={data}
          name="data"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            width: '100%',
            m: '0.48rem 0 1.93rem',
            label: {
              marginBottom: 0,
              fontSize: '15px',
              left: '-1px',
              color: theme.palette.text.secondary,
            },
            '& .MuiOutlinedInput-root fieldset': {
              transition: 'all .3s linear',
              borderColor: theme.palette.borders.secondary,
            },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.borders.active,
              },
            },
            '& .MuiOutlinedInput-input': {
              color: theme.palette.text.primary,
            },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              transition: 'all .3s linear',
              borderColor: theme.palette.borders.active,
              borderWidth: '1px',
            },
            '& label.MuiInputLabel-root.Mui-focused': {
              color: theme.palette.borders.active,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProposeSendEgld;
