import { useCallback, useEffect, useMemo } from 'react';
import { Address, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { Box, useMediaQuery } from '@mui/material';
import { FormikProps, FormikProvider, useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { FormikInputField } from 'src/helpers/formikFields';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import { selectedTokenToSendSelector } from 'src/redux/selectors/modalsSelector';
import { MultisigSendToken } from 'src/types/MultisigSendToken';
import { TokenTableRowItem } from 'src/pages/Organization/types';
import { TestContext } from 'yup';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { MultisigSendEgld } from 'src/types/MultisigSendEgld';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import RationalNumber from 'src/utils/RationalNumber';
import * as Styled from './styled';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken | MultisigSendEgld) => void;
  setSubmitDisabled: (value: boolean) => void;
}

export type TokenPresentationProps = {
    identifier: string;
};

interface IFormValues {
  address: string;
  identifier: string;
  amount: string;
  data?: string;
}

const ProposeSendToken = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendTokenType) => {
  const { t } = useTranslation();

  const selectedToken = useSelector(selectedTokenToSendSelector);
  const { identifier } = selectedToken;
  const tokenTableRows = useSelector<StateType, TokenTableRowItem[]>(tokenTableRowsSelector);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const availableTokensWithBalances = useMemo(
    () =>
      tokenTableRows?.map((token: TokenTableRowItem) => ({
        identifier: token.identifier,
        balance: RationalNumber.fromDynamicTokenAmount(
          token?.identifier ?? '', token?.balanceDetails?.amount ?? '', token?.balanceDetails?.decimals ?? 18,
        ),
      })),
    [tokenTableRows],
  );

  const selectedTokenBalance = useMemo(
    () => availableTokensWithBalances?.find(
      (token: TokenTableRowItem) => token?.identifier === identifier,
    )?.balance as string,
    [availableTokensWithBalances, identifier],
  );

  const selectedTokenDetails = useMemo(
    () => tokenTableRows?.find(
      (token: TokenTableRowItem) => token?.identifier === identifier,
    ),
    [identifier, tokenTableRows],
  );

  const currentContract = useSelector(currentMultisigContractSelector);

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      address: '',
      data: '',
      amount: '0',
    },
    validationSchema: Yup.object().shape({
      data: Yup.string(),
      address: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Required')
        .test('is valid address', 'Not a valid address', (value?: string) => {
          try {
            new Address(value).bech32();
            return true;
          } catch (err) {
            return false;
          }
        })
        .test('is not self address', 'Contract can not send to itself', (value?: string) => {
          try {
            const isCurrentContractAddress = value === currentContract?.address;
            return !isCurrentContractAddress;
          } catch (err) {
            return false;
          }
        }),
      amount: Yup.string()
        .required('Required')
        .test((value?: string, testContext?: TestContext) => {
          if (value == null) {
            return true;
          }

          const newAmount = Number(value?.replaceAll(',', ''));
          if (Number.isNaN(newAmount)) {
            setSubmitDisabled(true);
            return (
              testContext?.createError({
                message: 'Invalid amount',
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
            'There is not enough money in the organization for this transaction',
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

          const isDisabled = !formik.isValid || !formik.dirty;
          setSubmitDisabled(isDisabled);
          return true;
        }),
    }),
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { touched, errors, values } = formik;
  const { amount, address, data } = values;

  const getEgldProposal = useCallback((): MultisigSendEgld | null => {
    try {
      const addressParam = new Address(address);

      const amountNumeric = Number(formik.values.amount?.replaceAll(',', ''));
      if (Number.isNaN(amountNumeric)) {
        return null;
      }

      const amountParam = new BigUIntValue(
        TokenTransfer.egldFromAmount(amountNumeric).valueOf(),
      );

      return new MultisigSendEgld(addressParam, amountParam, data ?? '');
    } catch (err) {
      console.error('Error[SendToken]: ', err);
      return null;
    }
  }, [address, data, formik.values.amount]);

  const getSendTokenProposal = useCallback((amountParam: string): MultisigSendToken | null => {
    try {
      amountParam = amountParam.replaceAll(',', '');
      const amountNumeric = Number(amountParam ?? 0);
      if (Number.isNaN(amountNumeric)) {
        return null;
      }
      const parsedAddress = new Address(address);
      const amountToSend = Number(
        TokenTransfer
          .fungibleFromAmount(identifier, amountParam, selectedTokenDetails?.value?.decimals ?? 18).toString(),
      );

      return new MultisigSendToken(parsedAddress, identifier, amountToSend);
    } catch (err) {
      return null;
    }
  }, [address, identifier, selectedTokenDetails]);

  const refreshProposal = useCallback(() => {
    setTimeout(() => {
      const proposal = identifier === 'EGLD' ? getEgldProposal() : getSendTokenProposal(amount);

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  }, [getEgldProposal, getSendTokenProposal, handleChange, amount, identifier]);

  const amountError = touched.amount && errors.amount;
  const addressError = touched.address && errors.address;

  useEffect(() => {
    const shouldBeDisabled = !(formik.isValid && formik.dirty);
    setSubmitDisabled(shouldBeDisabled);
  }, [amount, address, setSubmitDisabled, formik.isValid, formik.dirty]);

  useEffect(() => {
    refreshProposal();
  }, [address, identifier, amount]);

  return (
    <FormikProvider value={formik}>
      <Box padding={maxWidth600 ? '16px 16px 4.8px' : '30.88px 40px 4.8px'}>
        <FormikInputField
          label={t('Send to')}
          name="address"
          value={address}
          error={addressError}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          className={addressError != null ? 'isError' : ''}
        />

        <AmountInputWithTokenSelection
          amount={amount}
          formik={formik}
          amountError={amountError}
          handleInputBlur={formik.handleBlur}
          handleInputChange={formik.handleChange}
          resetAmount={() => formik.setFieldValue('amount', 0)}
        />
        {identifier === 'EGLD' && (
        <motion.div
          key="Data"
          initial={{
            opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <Styled.DataTextField
            variant="outlined"
            label={t('Data (optional)') as string}
            placeholder="Your message here"
            id={data}
            name="data"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </motion.div>
        )}
      </Box>
    </FormikProvider>
  );
};

export default ProposeSendToken;
