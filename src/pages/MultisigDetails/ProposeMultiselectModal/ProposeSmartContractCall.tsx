import React, { useEffect, useMemo } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import {
  Address,
  Balance,
  BigUIntValue,
  BytesValue,
} from '@elrondnetwork/erdjs/out';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik, Form as FormikForm } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { TestContext } from 'yup';
import { denomination } from 'config';
import MultisigDetailsContext from 'context/MultisigDetailsContext';
import { FormikInputField } from 'helpers/formikFields';
import { MultisigSmartContractCall } from 'types/MultisigSmartContractCall';

interface ProposeSmartContractCallType {
  handleChange: (proposal: MultisigSmartContractCall) => void;
  setSubmitDisabled: (value: boolean) => void;
}

let formik: FormikForm;

function validateRecipient(value?: string) {
  try {
    const _address = new Address(value);
    return true;
  } catch (err) {
    return false;
  }
}

function validateArgument(value?: string[], testContext?: TestContext) {
  try {
    if (value == null) {
      return true;
    }
    value.map((arg) => BytesValue.fromHex(arg));
    return true;
  } catch (err) {
    return (
      testContext?.createError({
        message: 'Invalid arguments',
      }) ?? false
    );
  }
}

const ProposeSmartContractCall = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSmartContractCallType) => {
  const { multisigBalance } = React.useContext(MultisigDetailsContext);

  const { t }: { t: any } = useTranslation();

  function validateAmount(value?: string, testContext?: TestContext) {
    if (value == null) {
      return true;
    }
    const validatedAmount = Number(value);
    if (Number.isNaN(validatedAmount)) {
      return (
        testContext?.createError({
          message: 'Invalid amount',
        }) ?? false
      );
    }
    if (validatedAmount < 0) {
      formik.setFieldValue('amount', 0);
    }
    if (validatedAmount > Number(multisigBalance.toDenominated())) {
      return (
        testContext?.createError({
          message:
            'There are not enough money in the organization for this transaction',
        }) ?? false
      );
    }
    return true;
  }

  React.useEffect(() => {
    setSubmitDisabled(true);
  }, []);

  const denominatedValue = useMemo(
    () =>
      operations.denominate({
        input: multisigBalance.toString(),
        denomination,
        decimals: 4,
        showLastNonZeroDecimal: true,
      }),
    [multisigBalance],
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
    functionName: Yup.string(),
    args: Yup.array().test(validateArgument),
  });

  formik = useFormik({
    initialValues: {
      receiver: '',
      amount: 0,
      functionName: '',
      args: [],
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  const { touched, errors, values } = formik;
  const { amount, receiver, functionName, args } = values;
  const getProposal = (): MultisigSmartContractCall | null => {
    try {
      const addressParam = new Address(formik.values.receiver);

      const amountNumeric = Number(formik.values.amount);
      if (Number.isNaN(amountNumeric)) {
        return null;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );

      const argsParams = args.map((arg) => BytesValue.fromHex(arg));

      return new MultisigSmartContractCall(
        addressParam,
        amountParam,
        functionName,
        argsParams,
      );
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
  }, [formik.errors]);

  const addNewArgsField = () => {
    const nextArgNumber = args.length;
    formik.setFieldValue(`args[${nextArgNumber}]`, '');
  };

  const removeArg = (removeIdx: number) => {
    formik.setFieldValue(
      'args',
      args.filter((_, index: number) => index !== removeIdx),
    );
  };

  const receiverError = touched.receiver && errors.receiver;
  const amountError = touched.amount && errors.amount;
  const argsError =
    Array.isArray(touched?.args) &&
    touched.args.length === args.length &&
    touched.args.every((arg) => arg) &&
    errors.args;
  return (
    <div>
      <FormikInputField
        label={t('Send to')}
        name="receiver"
        value={receiver}
        error={receiverError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <div className="modal-control-container">
        <label htmlFor="amount">{t('Amount')}</label>
        <div className="input-wrapper">
          <Form.Control
            id="amount"
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
      <div className="modal-control-container">
        <label htmlFor={functionName}>{t('function name (optional)')}</label>
        <div className="input-wrapper">
          <Form.Control
            id={functionName}
            name="functionName"
            type="functionName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={functionName}
          />
        </div>
      </div>
      {functionName?.length > 0 && (
        <div className="d-flex flex-column ">
          {args.map((arg, idx) => (
            <div key={arg} className="modal-control-container mb-3">
              <label htmlFor={`args[${idx}]`}>
                {`${t('argument')} ${idx + 1}`}
              </label>
              <div className="d-flex align-items-stretch my-0">
                <Form.Control
                  id={`args[${idx}]`}
                  name={`args[${idx}]`}
                  className="my-0 mr-3"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={arg}
                />

                <button
                  onClick={() => removeArg(idx)}
                  className="action-remove action remove"
                >
                  <FontAwesomeIcon className="mx-2" icon={faMinus} />
                </button>
              </div>
            </div>
          ))}
          {argsError && <small className="text-danger">{argsError}</small>}
          <div className="modal-action-btns">
            <button onClick={addNewArgsField} className="btn btn-primary ">
              <FontAwesomeIcon className="mx-2" icon={faPlus} />
              <span className="name">Add argument</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposeSmartContractCall;
