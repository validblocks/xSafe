import { useEffect } from 'react';
import { Address, Balance } from '@elrondnetwork/erdjs/out';
import {
  BigUIntValue,
  BytesValue,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { FormikCheckbox, FormikInputField } from 'src/helpers/formikFields';
import { validateAddressIsContract } from 'src/helpers/validation';
import { MultisigDeployContractFromSource } from 'src/types/MultisigDeployContractFromSource';

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

  const {
    amount, source, args, upgradeable, payable, readable,
  } = values;

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

    const amountParam = new BigUIntValue(Balance.egld(amountNumeric).valueOf());
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
    <div>
      <FormikInputField
        label={t('Source')}
        name="source"
        value={source}
        error={sourceError as string}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <FormikInputField
        label={t('Amount')}
        name="amount"
        value={amount}
        error={amountError as string}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <div className="mt-4">
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
          <div key={arg} className="modal-control-container my-3">
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
        {argsError && <small className="text-danger">{argsError as string}</small>}
        <div className="modal-action-btns">
          <button onClick={addNewArgsField} className="btn btn-primary ">
            <FontAwesomeIcon className="mx-2" icon={faPlus} />
            <span className="name">Add argument</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposeDeployContractFromSource;
