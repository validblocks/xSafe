import { useEffect, useState } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address, Balance, BigUIntValue, BytesValue } from '@elrondnetwork/erdjs/out';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  activeDelegationsRowsSelector,
} from 'src/redux/selectors/accountSelector';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { denomination } from 'src/config';
import { TestContext } from 'yup';
import { StateType } from 'src/redux/slices/accountSlice';
import { setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { IdentityWithColumns } from 'src/types/staking';
import ProviderColumn from 'src/components/Staking/ProviderColumn';
import { Box } from '@mui/system';
import DelegatedColumn from 'src/components/Staking/DelegatedColumn';
import { delegationFunctionNames } from 'src/types/staking/delegationFunctionNames';
import { MultisigSmartContractCall } from 'src/types/MultisigSmartContractCall';
import { useEffectDebugger } from 'src/utils/useEffectDebugger';

interface ProposeUnstakeTokensType {
  handleChange: (proposal: MultisigSmartContractCall) => void;
  setSubmitDisabled: (value: boolean) => void;
}

function _validateRecipient(value?: string) {
  try {
    const _identifier = new Address(value);
    return true;
  } catch (err) {
    return false;
  }
}

export type TokenPresentationProps = {
    identifier: string;
};

interface IFormValues {
  identifier: string;
  amount: string;
}

const ProposeUnstakeTokens = ({
  handleChange,
  setSubmitDisabled,
}: ProposeUnstakeTokensType) => {
  const { t } = useTranslation();
  let formik: FormikProps<IFormValues>;

  const dispatch = useDispatch();

  const activeDelegationsRows = useSelector<StateType, IdentityWithColumns[]>(activeDelegationsRowsSelector);
  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);
  const [identifier, setIdentifier] = useState(selectedStakingProvider?.provider);

  const validateAmount = (value?: string, testContext?: TestContext) => {
    if (value == null) {
      return true;
    }
    const newAmount = Number(value);
    if (Number.isNaN(newAmount)) {
      console.log('amount NaN');
      setSubmitDisabled(true);
      return (
        testContext?.createError({
          message: 'Invalid amount',
        }) ?? false
      );
    }
    if (newAmount < 1) {
      formik.setFieldValue('amount', 1);
    }
    if (newAmount > Number(selectedStakingProvider?.delegatedColumn?.delegatedAmount ?? 1)) {
      console.log('balance not enough');
      setSubmitDisabled(true);
      return (
        testContext?.createError({
          message:
        t('There is not enough money in the organization for this transaction'),
        }) ?? false
      );
    }

    if (newAmount === 0) {
      console.log('amount 1');
      setSubmitDisabled(true);
      return (
        testContext?.createError({
          message: 'The amount should be greater than 1',
        }) ?? false
      );
    }

    setSubmitDisabled(!formik.isValid);
    return true;
  };

  const validationSchema = () =>
    Yup.object().shape({
      amount: Yup.string()
        .required('Required')
        .transform((value) => value.replace(',', '.'))
        .test(validateAmount),
    });

  formik = useFormik({
    initialValues: {
      amount: 1,
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,

  } as any);

  const { touched, errors, values } = formik;
  const { amount } = values;

  useEffect(() => {
    if (identifier) {
      if (!_validateRecipient(identifier)) {
        formik.setFieldError('identifier', t('Invalid address'));
      }
    }
  }, [formik, identifier, t]);

  const getProposal = (): MultisigSmartContractCall | null => {
    try {
      const nominatedAmount = operations.nominate(
        amount.toString(),
        denomination,
      );
      const amountNumeric = parseInt(nominatedAmount, 10);

      if (Number.isNaN(amountNumeric)) {
        return null;
      }

      const _amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );
      const parsedAddress = new Address(identifier);

      // const balance = Balance.fromString(nominatedAmount);
      // balance.
      // const _amountParamBytes = new BytesValue(balance.valueOf());

      console.log({ amountNumeric: amountNumeric.toString(16) });

      let hexEncodedAmount = amountNumeric.toString(16);
      if (hexEncodedAmount.length % 2 !== 0) { hexEncodedAmount = `0${hexEncodedAmount}`; }
      const unDelegateAmount = BytesValue.fromHex(hexEncodedAmount);

      return new MultisigSmartContractCall(
        parsedAddress,
        new BigUIntValue(
          Balance.egld(0).valueOf(),
        ),
        delegationFunctionNames.unDelegate,
        [unDelegateAmount],

      );
    } catch (err) {
      console.log('CATCHED', err);
      return null;
    }
  };

  const refreshProposal = () => {
    setTimeout(() => {
      const proposal = getProposal();

      if (proposal !== null) {
        console.log('proposal', proposal);
        handleChange(proposal);
      } else {
        console.log('NULL');
      }
    }, 100);
  };

  useEffectDebugger(() => {
    refreshProposal();
  }, [formik.values, formik.errors]);

  const amountError = touched.amount && errors.amount;

  const onChange = (event: SelectChangeEvent) => {
    const newIdentifier = event.target.value;
    setIdentifier(newIdentifier);
    const newProvider = activeDelegationsRows.find((provider) => provider.provider === newIdentifier);
    dispatch(setSelectedStakingProvider(newProvider));
    formik.setFieldValue('amount', 1);

    const proposal = getProposal();

    if (proposal !== null) {
      console.log('proposal', proposal);
      handleChange(proposal);
    }
  };

  useEffect(() => {
    console.log({ isValid: formik.isValid });
    // console.log({ dirty: formik.dirty });
    setSubmitDisabled((!formik.isValid));
  }, [formik.isValid, formik.dirty, setSubmitDisabled]);

  return (
    <div className="px-4 py-3">
      <div className="modal-control-  container mb-4">
        <InputLabel id="demo-simple-select-label">Staking Provider</InputLabel>
        <Select
          value={identifier}
          fullWidth
          label="Identifier"
          size="small"
          onChange={(e: any) => { onChange(e); formik.handleChange(e); }}
          className="mb-2"
          sx={{
            '.MuiInputBase-input': {
              paddingY: '0 !important',
            } }}
        >
          {activeDelegationsRows?.map((activeDelegation: IdentityWithColumns) => (
            <MenuItem
              key={activeDelegation?.provider}
              value={activeDelegation?.provider}
              sx={{ paddingY: '0' }}
            >
              <Box padding={0} width={'100%'} display={'flex'} alignItems="center" justifyContent={'space-between'}>
                <ProviderColumn columnData={activeDelegation?.providerColumn} />
                <DelegatedColumn columnData={activeDelegation?.delegatedColumn ?? { delegatedAmount: 'Unknown' }} />
              </Box>
            </MenuItem>
          ))}
        </Select>
        <div>
          Staked:
          {' '}
          {selectedStakingProvider?.delegatedColumn?.delegatedAmount ?? 'Unknown'}
          {' '}
          $EGLD
        </div>
      </div>

      <div className="modal-control-container">
        <div className="input-wrapper">
          <label htmlFor={amount}>
            {`${t('Amount')}:`}
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
        </div>
      </div>

    </div>
  );
};

export default ProposeUnstakeTokens;
