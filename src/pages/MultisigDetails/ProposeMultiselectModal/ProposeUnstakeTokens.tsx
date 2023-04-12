import { useCallback, useEffect, useState } from 'react';
import { nominate } from '@multiversx/sdk-dapp/utils/operations';
import { Address, BigUIntValue, BytesValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { InputLabel, MenuItem, SelectChangeEvent, useMediaQuery } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { denomination } from 'src/config';
import * as Yup from 'yup';
import {
  activeDelegationsRowsSelector,
} from 'src/redux/selectors/accountSelector';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { TestContext } from 'yup';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { IdentityWithColumns } from 'src/types/staking';
import ProviderColumn from 'src/components/Staking/ProviderColumn';
import { Box } from '@mui/system';
import DelegatedColumn from 'src/components/Staking/DelegatedColumn';
import { delegationFunctionNames } from 'src/types/staking/delegationFunctionNames';
import { MultisigSmartContractCall } from 'src/types/MultisigSmartContractCall';
import { useEffectDebugger } from 'src/utils/useEffectDebugger';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import { StakedAssetsSelect, UnstakeModalContainerBox } from '../styled';

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

  const dispatch = useDispatch();

  const activeDelegationsRows = useSelector<StateType, IdentityWithColumns[]>(activeDelegationsRowsSelector);
  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);
  const [identifier, setIdentifier] = useState(selectedStakingProvider?.provider);

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      amount: 1,
    },
    validationSchema: Yup.object().shape({
      amount: Yup.string()
        .required('Required')
        .transform((value) => value.replace(',', '.'))
        .test((value?: string, testContext?: TestContext) => {
          if (value == null) {
            return true;
          }
          const newAmount = Number(value);
          if (Number.isNaN(newAmount)) {
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

          const delegatedAmount = Number(selectedStakingProvider?.delegatedColumn?.delegatedAmount ?? 0);
          if (newAmount > delegatedAmount) {
            setSubmitDisabled(true);
            return (
              testContext?.createError({
                message:
        t('There are not enough tokens staked for this proposal'),
              }) ?? false
            );
          }

          const leftOverStakedAmount = delegatedAmount - newAmount;
          if (leftOverStakedAmount < 1 && leftOverStakedAmount !== 0) {
            setSubmitDisabled(true);
            return (
              testContext?.createError({
                message:
        t('Can not leave behind less than 1 EGLD'),
              }) ?? false
            );
          }

          if (newAmount === 0) {
            setSubmitDisabled(true);
            return (
              testContext?.createError({
                message: 'The amount should be greater than 0',
              }) ?? false
            );
          }

          setSubmitDisabled(!formik.isValid);
          return true;
        }),
    }),
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
      const nominatedAmount = nominate(
        amount.toString(),
        denomination,
      );
      const amountNumeric = parseInt(nominatedAmount, 10);

      if (Number.isNaN(amountNumeric)) {
        return null;
      }

      const parsedAddress = new Address(identifier);

      let hexEncodedAmount = amountNumeric.toString(16);
      if (hexEncodedAmount.length % 2 !== 0) { hexEncodedAmount = `0${hexEncodedAmount}`; }
      const unDelegateAmount = BytesValue.fromHex(hexEncodedAmount);

      return new MultisigSmartContractCall(
        parsedAddress,
        new BigUIntValue(
          TokenTransfer.egldFromAmount(0).valueOf(),
        ),
        delegationFunctionNames.unDelegate,
        [unDelegateAmount],

      );
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
      handleChange(proposal);
    }
  };

  useEffect(() => {
    setSubmitDisabled((!formik.isValid));
  }, [formik.isValid, formik.dirty, setSubmitDisabled]);

  const autocompleteMaxAmount = useCallback(() => {
    const delegatedAmount = selectedStakingProvider?.delegatedColumn?.delegatedAmount;
    formik.setFieldValue('amount', +delegatedAmount);
  }, [formik, selectedStakingProvider?.delegatedColumn?.delegatedAmount]);

  const maxWidth600 = useMediaQuery('(max-width: 600px)');

  return (
    <UnstakeModalContainerBox
      sx={{
        padding: maxWidth600 ? '1.4rem 16px .3rem' : '1.4rem 40px .3rem',
      }}
    >
      <div className="mb-4">
        <InputLabel id="demo-simple-select-label"><Text>Staking Provider</Text></InputLabel>
        <StakedAssetsSelect
          value={identifier}
          fullWidth
          label="Identifier"
          size="small"
          MenuProps={{ className: 'UnstakeTokenListOpened' }}
          onChange={(e: any) => { onChange(e); formik.handleChange(e); }}
          className="mb-0"
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
          ) as any)}
        </StakedAssetsSelect>

        <span>
          Staked:
          {' '}
          {selectedStakingProvider?.delegatedColumn?.delegatedAmount ?? 'Unknown'}
          {' '}
          $EGLD
        </span>
      </div>
      <AmountInputWithTokenSelection
        handleMaxButtonClick={autocompleteMaxAmount}
        handleInputChange={formik.handleChange}
        handleInputBlur={formik.handleBlur}
        amount={amount}
        amountError={amountError}
        resetAmount={() => formik.setFieldValue('amount', 0)}
        config={{ withAvailableAmount: false, withTokenSelection: false }}
      />
    </UnstakeModalContainerBox>
  );
};

export default ProposeUnstakeTokens;
