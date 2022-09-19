import { useContext, useEffect, useMemo } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import {
  Address,
  Balance,
  BigUIntValue,
  BytesValue,
} from '@elrondnetwork/erdjs/out';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProps, useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { TestContext } from 'yup';
import MultisigDetailsContext from 'src/context/MultisigDetailsContext';
import { FormikInputField } from 'src/helpers/formikFields';
import { denomination } from 'src/config';
import { MultisigSmartContractCall } from 'src/types/MultisigSmartContractCall';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box, TextField } from '@mui/material';
import { InputsContainer, MainButton, RemoveItemsButton } from 'src/components/Theme/StyledComponents';
import { Text } from 'src/components/StyledComponents/StyledComponents';

interface ProposeSmartContractCallType {
  handleChange: (proposal: MultisigSmartContractCall) => void;
  setSubmitDisabled: (value: boolean) => void;
}

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

interface IFormValues {
  receiver: string,
  amount: string,
  functionName: string,
  args: string[],
}

const ProposeSmartContractCall = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSmartContractCallType) => {
  const { multisigBalance } = useContext(MultisigDetailsContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  let formik: FormikProps<IFormValues>;

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
    functionName: Yup.string(),
    args: Yup.array().test(validateArgument),
  });

  formik = useFormik<IFormValues>({
    initialValues: {
      receiver: '',
      amount: 0,
      functionName: '',
      args: [],
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  useEffect(() => {
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

  const { touched, errors, values } = formik;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <Box sx={{ p: '1.9rem 2.5rem 0rem' }}>
      <FormikInputField
        label={t('Send to')}
        name="receiver"
        value={receiver}
        error={receiverError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={receiverError ? 'isError' : ''}
      />
      <InputsContainer
        className={amountError != null ? 'hasAvailableAmount invalid' : 'hasAvailableAmount'}
      >
        <Form.Control
          id="amount"
          name="amount"
          isInvalid={amountError != null}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={amount}
        />

        <label htmlFor="amount">{t('Amount') as string}</label>

        <span className="errorMessage">{amountError}</span>

        <Text
          fontSize={13}
          variant="subtitle2"
          className="availableAmount"
        >{`${t('Available')}: ${denominatedValue} EGLD`}
        </Text>
      </InputsContainer>
      <Box>
        <TextField
          variant="outlined"
          label={t('Function name (optional)') as string}
          id={functionName}
          name="functionName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={functionName}
          sx={{
            width: '100%',
            m: '0.48rem 0 1.93rem',
            label: {
              marginBottom: 0,
              fontSize: '15px',
              left: '-1px',
            },
            '& .MuiOutlinedInput-root fieldset': {
              transition: 'all .3s linear',
              borderColor: 'rgba(76, 47, 252, 0.23)',
            },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              transition: 'all .3s linear',
              borderColor: '#4c2ffc',
              borderWidth: '1px',
            },
            '& label.MuiInputLabel-root.Mui-focused': {
              color: '#4c2ffc',
            },
          }}
        />
      </Box>
      {functionName?.length > 0 && (
        <Box>
          {args.map((arg, idx) => (
            <Box key={arg} display={'flex'}>
              <InputsContainer
                width={'100%'}
                className={argsError ? 'invalid' : ''}
                sx={{ '.invalid': { mb: '1rem' } }}
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

                {argsError && <small className="text-danger mx-1">{argsError}</small>}
              </InputsContainer>
              <RemoveItemsButton
                onClick={() => removeArg(idx)}
                sx={{ alignSelf: 'flex-start', mt: '9px', ml: '7px' }}
              >
                <FontAwesomeIcon className="mx-2" icon={faMinus as IconProp} />
              </RemoveItemsButton>
            </Box>
          ))}
          <MainButton sx={{ width: '100%', mb: '10px !important', mt: '5px' }} onClick={addNewArgsField}>
            Add argument
          </MainButton>
        </Box>
      )}

      {/* <div>
        <h1>Just testing</h1>
        <Formik
          initialValues={{ friends: ['jared'] }}
          onSubmit={(values) =>
            // setTimeout(() => {
            //   alert(JSON.stringify(values, null, 2));
            // }, 500)
            console.log(values)
      }
        >
          {({ values }) => (
            <Form>
              <FieldArray
                name="friends"
                render={(arrayHelpers) => (
                  <div>
                    {values.friends && values.friends.length > 0 ? (
                      values.friends.map((friend, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index}>
                          <InputsContainer
                            width={'100%'}
                            className={_argsError ? 'invalid' : ''}
                            sx={{ '.invalid': { mb: '1rem' } }}
                          >
                            <TextField
                              id={`firends.${index}`}
                              name={`firends.${index}`}
                              type="text"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={_argsError != null}
                            />
                          </InputsContainer>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, '')}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button type="button" onClick={() => arrayHelpers.push('')}>
                        Add a friend
                      </button>
                    )}
                    <div>
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      </div> */}

    </Box>
  );
};

export default ProposeSmartContractCall;
