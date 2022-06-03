import React, { useEffect, useMemo } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address, Balance, BigUIntValue } from '@elrondnetwork/erdjs/out';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { TestContext } from 'yup';
import { denomination } from 'config';
import { FormikInputField } from 'helpers/formikFields';
import { multisigBalanceSelector } from 'redux/selectors/accountSelector';
import { MultisigSendEgld } from 'types/MultisigSendEgld';

interface ProposeSendEgldType {
  handleChange: (proposal: MultisigSendEgld) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeSendEgld = ({
  handleChange,
  setSubmitDisabled
}: ProposeSendEgldType) => {
  const multisigBalance = useSelector(multisigBalanceSelector);

  const { t } = useTranslation();

  React.useEffect(() => {
    setSubmitDisabled(true);
  }, []);

  const denominatedValue = useMemo(
    () =>
      operations.denominate({
        input: multisigBalance.asString,
        denomination: denomination,
        decimals: 4,
        showLastNonZeroDecimal: true
      }),
    [multisigBalance]
  );

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
    data: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      receiver: '',
      amount: 0,
      data: ''
    },
    onSubmit: () => {
      return;
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true
  });

  const { touched, errors, values } = formik;
  const { amount, receiver, data } = values;

  useEffect(() => {
    refreshProposal();
  }, [formik.values, formik.errors]);

  useEffect(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [formik.errors]);

  const getProposal = (): MultisigSendEgld | null => {
    try {
      const addressParam = new Address(formik.values.receiver);

      const amountNumeric = Number(formik.values.amount);
      if (isNaN(amountNumeric)) {
        return null;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf()
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

  function validateRecipient(value?: string) {
    try {
      new Address(value);
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
          message: 'Invalid amount'
        }) ?? false
      );
    }
    if (newAmount < 0) {
      formik.setFieldValue('amount', 0);
    }
    if (newAmount > Number(multisigBalance.asCurrencyString.split(' '[0]))) {
      return (
        testContext?.createError({
          message:
            'There are not enough money in the organization for this transaction'
        }) ?? false
      );
    }
    return true;
  }

  const receiverError = touched.receiver && errors.receiver;
  const amountError = touched.amount && errors.amount;
  return (
    <div>
      <FormikInputField
        label={t('Send to')}
        name={'receiver'}
        value={receiver}
        error={receiverError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <div className='modal-control-container'>
        <label>{t('Amount')} </label>
        <div className='input-wrapper'>
          <Form.Control
            id='amount'
            name='amount'
            isInvalid={amountError != null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={amount}
          />

          {amountError != null && (
            <Form.Control.Feedback type={'invalid'}>
              {amountError}
            </Form.Control.Feedback>
          )}
        </div>
        <span>{`Balance: ${denominatedValue} EGLD`} </span>
      </div>
      <div className='modal-control-container'>
        <label>{t('data (optional)')} </label>
        <Form.Control
          id='data'
          name='data'
          type='data'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={data}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;
