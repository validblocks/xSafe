import { useEffect } from 'react';
import { Address, TokenPayment } from '@multiversx/sdk-core/out';
import {
  BigUIntValue,
  BytesValue,
} from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { FormikCheckbox, FormikInputField } from 'src/helpers/formikFields';
import { validateAddressIsContract } from 'src/helpers/validation';
import { MultisigDeployContractFromSource } from 'src/types/MultisigDeployContractFromSource';
import { Box } from '@mui/material';
import { InputsContainer, MainButton, RemoveItemsButton } from 'src/components/Theme/StyledComponents';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as Styled from './styled';

interface ProposeDeployContractFromSourceType {
  handleChange: (proposal: MultisigDeployContractFromSource) => void;
  setSubmitDisabled: (value: boolean) => void;
}
function validateAmount(value?: string) {
  const amountNumeric = Number(value);
  return !Number.isNaN(amountNumeric);
}

function validateArgument(value?: string[], testContext?: Yup.TestContext) {
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

const ProposeDeployContractFromSource = ({
  handleChange,
  setSubmitDisabled,
}: ProposeDeployContractFromSourceType) => {
  const { t }: { t: any } = useTranslation();

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required('Required').test(validateAmount),
    source: Yup.string().required('required').test(validateAddressIsContract),
    upgradeable: Yup.boolean(),
    payable: Yup.boolean(),
    readable: Yup.boolean(),
    args: Yup.array().test(validateArgument),
  });

  const formik = useFormik({
    initialValues: {
      amount: '0',
      source: '',
      args: [],
      upgradeable: true,
      payable: true,
      readable: true,
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);
  const { touched, errors, values } = formik;

  const { amount, source, args, upgradeable, payable, readable } = values;

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [errors]);

  const getProposal = (): MultisigDeployContractFromSource | null => {
    const amountNumeric = Number(amount);
    if (Object.keys(errors).length > 0) {
      return null;
    }
    if (Number.isNaN(amountNumeric)) {
      return null;
    }

    const amountParam = new BigUIntValue(TokenPayment.egldFromAmount(amountNumeric).valueOf());
    const argsParams = args.map((arg: string) => BytesValue.fromHex(arg));

    return new MultisigDeployContractFromSource(
      amountParam,
      new Address(source),
      upgradeable,
      payable,
      readable,
      argsParams,
    );
  };

  const refreshProposal = () => {
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const addNewArgsField = () => {
    const nextArgNumber = args.length;
    formik.setFieldValue(`args[${nextArgNumber}]`, '');
  };

  const removeArg = (removeIdx: number) => {
    formik.setFieldValue(
      'args',
      args.filter((_: string, index: number) => index !== removeIdx),
    );
  };

  useEffect(() => {
    refreshProposal();
  }, [amount, source, args, upgradeable, payable, readable, errors]);

  const sourceError = touched.source && errors.source;

  const amountError = touched.amount && errors.amount;
  const argsError =
    Array.isArray(touched?.args) &&
    touched.args.length === args.length &&
    touched.args.every((arg) => arg) &&
    errors.args;

  return (
    <Styled.SelectProposalTypesModalContainer>
      <FormikInputField
        label={t('Source')}
        name="source"
        value={source}
        error={sourceError as string}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={sourceError ? 'isError' : ''}
      />
      <FormikInputField
        label={t('Amount')}
        name="amount"
        value={amount}
        error={amountError as string}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={amountError ? 'isError' : ''}
      />
      <div className="mb-3">
        <FormikCheckbox
          label={t('Upgradeable')}
          name="upgradeable"
          checked={upgradeable}
          handleChange={formik.handleChange}
        />
        <FormikCheckbox
          label={t('Payable')}
          name="payable"
          checked={payable}
          handleChange={formik.handleChange}
        />
        <FormikCheckbox
          label={t('Readable')}
          name="readable"
          checked={readable}
          handleChange={formik.handleChange}
        />
      </div>
      <div className="d-flex flex-column">
        {args.map((arg: string, idx: number) => (
          <Box key={arg} display={'flex'}>
            <InputsContainer
              width={'100%'}
              className={argsError ? 'invalid' : ''}
            >
              <Form.Control
                id={`args[${idx}]`}
                name={`args[${idx}]`}
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={arg}
                isInvalid={argsError != null}
              />

              <label htmlFor={`args[${idx}]`}>
                {`${t('Argument')} ${idx + 1}`}
              </label>

              <span className="errorMessage">{argsError as string}</span>
            </InputsContainer>
            <RemoveItemsButton
              onClick={() => removeArg(idx)}
              sx={{ alignSelf: 'flex-start', mt: '10px', ml: '7px' }}
            >
              <FontAwesomeIcon className="mx-2" icon={faMinus as IconProp} />
            </RemoveItemsButton>
          </Box>
        ))}
        <MainButton sx={{ width: '100%', mb: '10px !important', mt: '5px' }} onClick={addNewArgsField}>
          Add argument
        </MainButton>
      </div>
    </Styled.SelectProposalTypesModalContainer>
  );
};

export default ProposeDeployContractFromSource;
