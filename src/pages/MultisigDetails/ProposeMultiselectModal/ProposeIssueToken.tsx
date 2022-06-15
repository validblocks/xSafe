import React, { useEffect } from 'react';
import { isNaN, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { TestContext } from 'yup';
import { FormikCheckbox, FormikInputField } from 'helpers/formikFields';
import { MultisigIssueToken } from 'types/MultisigIssueToken';

interface ProposeIssueTokenType {
  handleChange: (proposal: MultisigIssueToken) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeIssueToken = ({
  handleChange,
  setSubmitDisabled,
}: ProposeIssueTokenType) => {
  const { t }: { t: any } = useTranslation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    identifier: Yup.string().required('Required'),
    amount: Yup.string().required('Required').test(validateAmount),
    decimals: Yup.string().required('Required').test(validateAmount),
    canFreeze: Yup.boolean(),
    canWipe: Yup.boolean(),
    canPause: Yup.boolean(),
    canMint: Yup.boolean(),
    canBurn: Yup.boolean(),
    canChangeOwner: Yup.boolean(),
    canUpgrade: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      identifier: '',
      amount: '0',
      decimals: '',
      canFreeze: true,
      canWipe: true,
      canPause: true,
      canMint: true,
      canBurn: true,
      canChangeOwner: true,
      canUpgrade: true,
    },
    onSubmit: () => {

    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });
  const { touched, errors, values } = formik;

  const {
    name,
    identifier,
    amount,
    decimals,
    canFreeze,
    canWipe,
    canPause,
    canMint,
    canBurn,
    canChangeOwner,
    canUpgrade,
  } = values;

  const amountError = touched.amount && errors.amount;
  const nameError = touched.name && errors.name;
  const decimalsError = touched.decimals && errors.decimals;
  const identifierError = touched.identifier && errors.identifier;

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [errors]);

  function validateAmount(value?: string, testContext?: TestContext) {
    const amountNumeric = Number(value);
    if (isNaN(amountNumeric)) {
      return false;
    }
    if (amountNumeric === 0) {
      return (
        testContext?.createError({
          message: 'Amount cannot be 0',
        }) ?? false
      );
    }
    return true;
  }

  const getProposal = (): MultisigIssueToken | null => {
    const amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    const decimalsNumeric = Number(decimals);
    if (isNaN(decimalsNumeric)) {
      return null;
    }

    const result = new MultisigIssueToken(
      name,
      identifier.toUpperCase(),
      amountNumeric,
      decimalsNumeric,
    );
    result.canFreeze = canFreeze;
    result.canWipe = canWipe;
    result.canPause = canPause;
    result.canMint = canMint;
    result.canBurn = canBurn;
    result.canChangeOwner = canChangeOwner;
    result.canUpgrade = canUpgrade;

    return result;
  };

  const refreshProposal = () => {
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  React.useEffect(() => {
    refreshProposal();
  }, [
    name,
    identifier,
    amount,
    decimals,
    canFreeze,
    canWipe,
    canPause,
    canMint,
    canBurn,
    canChangeOwner,
    canUpgrade,
  ]);

  return (
    <div>
      <FormikInputField
        label={t('Name')}
        name="name"
        value={name}
        error={nameError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />

      <FormikInputField
        label={t('Identifier')}
        name="identifier"
        value={identifier}
        error={identifierError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <FormikInputField
        label={t('Mint Amount')}
        name="amount"
        value={amount}
        error={amountError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <FormikInputField
        label={t('Decimals')}
        name="decimals"
        value={decimals}
        error={decimalsError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <FormikCheckbox
        label={t('Can Freeze')}
        name="canFreeze"
        checked={canFreeze}
        handleChange={formik.handleChange}
      />

      <FormikCheckbox
        label={t('Can Wipe')}
        name="canWipe"
        checked={canWipe}
        handleChange={formik.handleChange}
      />

      <FormikCheckbox
        label={t('Can Pause')}
        name="canPause"
        checked={canPause}
        handleChange={formik.handleChange}
      />
      <FormikCheckbox
        label={t('Can Mint')}
        name="canMint"
        checked={canMint}
        handleChange={formik.handleChange}
      />

      <FormikCheckbox
        label={t('Can Burn')}
        name="canBurn"
        checked={canBurn}
        handleChange={formik.handleChange}
      />
      <FormikCheckbox
        label={t('Can Change Owner')}
        name="canChangeOwner"
        checked={canChangeOwner}
        handleChange={formik.handleChange}
      />
      <FormikCheckbox
        label={t('Can Upgrade')}
        name="canUpgrade"
        checked={canUpgrade}
        handleChange={formik.handleChange}
      />
    </div>
  );
};

export default ProposeIssueToken;
