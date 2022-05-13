import React, { useEffect, useMemo, useState } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TestContext } from 'yup';
import * as Yup from 'yup';
import { denomination } from 'config';
import { FormikInputField } from 'helpers/formikFields';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { organizationTokensSelector } from 'redux/selectors/accountSelector';
import { selectedTokenToSendSelector } from 'redux/selectors/modalsSelector';
import { MultisigSendToken } from 'types/MultisigSendToken';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken) => void;
  setSubmitDisabled: (value: boolean) => void;
}

function validateRecipient(value?: string) {
  try {
    new Address(value);
    return true;
  } catch (err) {
    return false;
  }
}

const ProposeSendToken = ({
  handleChange,
  setSubmitDisabled
}: ProposeSendTokenType) => {
  const { t } = useTranslation();

  const selectedToken = useSelector(selectedTokenToSendSelector);
  const [identifier, setIdentifier] = useState(selectedToken.identifier);
  const organizationTokens = useSelector(organizationTokensSelector);

  const availableTokensWithBalances = useMemo(
    () =>
      organizationTokens.map((token) => ({
        identifier: token.identifier,
        balance: operations.denominate({
          input: token?.balanceDetails?.amount as string,
          denomination: token?.balanceDetails?.decimals as number,
          decimals: token?.balanceDetails?.decimals as number,
          showLastNonZeroDecimal: true,
          addCommas: false
        })
      })),
    []
  );

  const validateAmount = (value?: string, testContext?: TestContext) => {
    if (value == null) {
      return true;
    }
    const newAmount = Number(value);
    if (Number.isNaN(newAmount)) {
      setSubmitDisabled(true);
      return (
        testContext?.createError({
          message: 'Invalid amount'
        }) ?? false
      );
    }
    if (newAmount < 0) {
      formik.setFieldValue('amount', 0);
    }
    if (newAmount > Number(selectedTokenBalance)) {
      setSubmitDisabled(true);
      return (
        testContext?.createError({
          message:
            'There are not enough money in the organization for this transaction'
        }) ?? false
      );
    }

    setSubmitDisabled(!formik.isValid || !formik.dirty);
    return true;
  };

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        address: Yup.string()
          .min(2, 'Too Short!')
          .max(500, 'Too Long!')
          .required('Required')
          .test(validateRecipient),
        amount: Yup.string()
          .required('Required')
          .transform((value) => value.replace(',', '.'))
          .test(validateAmount)
      }),
    [validateAmount, validateRecipient]
  );

  const formik = useFormik({
    initialValues: {
      address: '',
      amount: 0
    },
    onSubmit: () => {
      return;
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true
  });

  const { touched, errors, values } = formik;
  const { amount, address } = values;

  const getProposal = (): MultisigSendToken | null => {
    try {
      const nominatedAmount = operations.nominate(
        amount.toString(),
        denomination
      );
      const amountNumeric = Number(nominatedAmount);
      if (isNaN(amountNumeric)) {
        return null;
      }
      const parsedAddress = new Address(address);

      return new MultisigSendToken(parsedAddress, identifier, amountNumeric);
    } catch (err) {
      return null;
    }
  };

  const refreshProposal = () => {
    setTimeout(() => {
      const proposal = getProposal();

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const selectedTokenBalance = useMemo(
    () =>
      availableTokensWithBalances.find(
        (token) => token.identifier === identifier
      )?.balance as string,
    [identifier]
  );

  const amountError = touched.amount && errors.amount;
  const addressError = touched.address && errors.address;

  const onIdentifierChanged = (event: SelectChangeEvent) => {
    setIdentifier(event.target.value as string);
    formik.setFieldValue('amount', 0);
  };

  useEffect(() => {
    setSubmitDisabled(!(formik.isValid && formik.dirty));
  }, [amount, address]);

  React.useEffect(() => {
    refreshProposal();
  }, [address, identifier, amount]);

  return (
    <div>
      <div className='modal-control-container mb-4'>
        <FormikInputField
          label={t('Send to')}
          name={'address'}
          value={address}
          error={addressError}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
        />
      </div>
      <div className='modal-control-container mb-4'>
        <InputLabel id='demo-simple-select-label'>Identifier</InputLabel>
        <Select
          value={identifier}
          fullWidth
          label='Identifier'
          onChange={onIdentifierChanged}
          className='mb-2'
        >
          {availableTokensWithBalances.map((token, idx) => {
            return (
              <MenuItem key={idx} value={token.identifier}>
                {token.identifier?.split('-')[0]}
              </MenuItem>
            );
          })}
        </Select>
        <div>
          Balance:{' '}
          {Number(
            availableTokensWithBalances.find(
              (token) => token.identifier === identifier
            )?.balance
          ).toFixed(5)}
        </div>
      </div>

      <div className='modal-control-container'>
        <div className='input-wrapper'>
          <label>{t('Amount')}: </label>
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
      </div>
    </div>
  );
};

export default ProposeSendToken;
