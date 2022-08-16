import { useEffect, useMemo } from 'react';
import { Address, Balance, BigUIntValue } from '@elrondnetwork/erdjs/out';
import { FormikProps, useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { TestContext } from 'yup';
import { organizationTokenByIdentifierSelector } from 'src/redux/selectors/accountSelector';
import { FormikInputField } from 'src/helpers/formikFields';
import { MultisigSendEgld } from 'src/types/MultisigSendEgld';
import { OrganizationToken } from 'src/pages/Organization/types';
import { StateType } from 'src/redux/slices/accountSlice';
import { Box } from '@mui/material';
import { InputsContainer } from 'src/components/Theme/StyledComponents';

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

  const organizationEgld = useSelector<StateType, OrganizationToken>(organizationTokenByIdentifierSelector('EGLD'));

  const egldBalanceString = useMemo(() => organizationEgld.tokenAmount, [organizationEgld]);

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
      amount: 0,
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

  console.log({ amountError });

  return (
    <Box sx={{ p: '1.93rem 2.5rem .3rem' }}>
      <FormikInputField
        label={t('Send to')}
        name="receiver"
        value={receiver}
        error={receiverError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <Box sx={{ mt: '1.2rem !important' }}>
        <InputsContainer>
          <label htmlFor={amount}>
            {`${t('Amount')}`}
          </label>
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
          <span>{`Balance: ${egldBalanceString} EGLD`}</span>
        </InputsContainer>
      </Box>
      <Box>
        <InputsContainer>
          <label htmlFor={amount} className="test">
            {`${t('Data (optional)')}`}
          </label>
          <Form.Control
            id={data}
            name="data"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={data}
          />
        </InputsContainer>
      </Box>
    </Box>
  );
};

export default ProposeSendEgld;
