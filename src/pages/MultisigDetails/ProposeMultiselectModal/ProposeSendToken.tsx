import { useEffect, useMemo, useState } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address, Balance, BigUIntValue } from '@elrondnetwork/erdjs/out';
import { Box, MenuItem, SelectChangeEvent, useMediaQuery } from '@mui/material';
import { FormikProps, FormikProvider, useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { FormikInputField } from 'src/helpers/formikFields';
import { accountSelector, getTokenPhotoById, tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import { selectedTokenToSendSelector } from 'src/redux/selectors/modalsSelector';
import { denomination } from 'src/config';
import { MultisigSendToken } from 'src/types/MultisigSendToken';
import { OrganizationToken, TokenTableRowItem } from 'src/pages/Organization/types';
import { TestContext } from 'yup';
import TokenPresentationWithPrice from 'src/components/Utils/TokenPresentationWithPrice';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { setSelectedTokenToSend } from 'src/redux/slices/modalsSlice';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { MultisigSendEgld } from 'src/types/MultisigSendEgld';
import { NumericFormat } from 'react-number-format';
import * as Styled from './styled';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken | MultisigSendEgld) => void;
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
  let formik: FormikProps<IFormValues>;
  const dispatch = useDispatch();

  const selectedToken = useSelector(selectedTokenToSendSelector);
  const [identifier, setIdentifier] = useState(selectedToken?.identifier);
  const tokenTableRows = useSelector<StateType, TokenTableRowItem[]>(tokenTableRowsSelector);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const availableTokensWithBalances = useMemo(
    () =>
      tokenTableRows?.map((token: TokenTableRowItem) => ({
        identifier: token.identifier,
        balance: Balance.fromString(token?.balanceDetails?.amount ?? '').toDenominated(),
      })),
    [tokenTableRows],
  );

  const selectedTokenBalance = useMemo(
    () => availableTokensWithBalances?.find(
      (token: TokenTableRowItem) => token?.identifier === identifier,
    )?.balance as string,
    [availableTokensWithBalances, identifier],
  );

  const validateAmount = (value?: string, testContext?: TestContext) => {
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

    setSubmitDisabled(!formik.isValid || !formik.dirty);
    return true;
  };

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        data: Yup.string(),
        address: Yup.string()
          .min(2, 'Too Short!')
          .max(500, 'Too Long!')
          .required('Required')
          .test(validateRecipient),
        amount: Yup.string()
          .required('Required')
          .transform((value) => value.replaceAll(',', ''))
          .test(validateAmount),
      }),
    [validateAmount, validateRecipient],
  );

  formik = useFormik({
    initialValues: {
      address: '',
      data: '',
      amount: '1',
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { touched, errors, values } = formik;
  const { amount, address, data } = values;

  const getEgldProposal = (): MultisigSendEgld | null => {
    try {
      const addressParam = new Address(address);

      const amountNumeric = Number(formik.values.amount?.replaceAll(',', ''));
      if (Number.isNaN(amountNumeric)) {
        return null;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );

      return new MultisigSendEgld(addressParam, amountParam, data ?? '');
    } catch (err) {
      console.error('Error[SendToken]: ', err);
      return null;
    }
  };

  const getSendTokenProposal = (): MultisigSendToken | null => {
    try {
      const nominatedAmount = operations.nominate(
        amount,
        denomination,
      );

      const amountNumeric = Number(nominatedAmount?.replaceAll(',', '') ?? 0);
      if (Number.isNaN(amountNumeric)) {
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
      const proposal = identifier === 'EGLD' ? getEgldProposal() : getSendTokenProposal();

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const amountError = touched.amount && errors.amount;
  const addressError = touched.address && errors.address;

  useEffect(() => {
    if (!selectedToken?.identifier) {
      const [firstAvailable] = tokenTableRows;
      if (!firstAvailable) {
        setIdentifier('EGLD');
      }

      setIdentifier(firstAvailable?.identifier);
      dispatch(
        setSelectedTokenToSend({
          id: firstAvailable?.identifier,
          identifier: firstAvailable?.identifier,
          balance: firstAvailable?.balance,
        }),
      );
    }
  }, [dispatch, identifier, tokenTableRows]);

  const onIdentifierChanged = (event: SelectChangeEvent) => {
    const newIdentifier = event.target.value;
    setIdentifier(newIdentifier as string);
    formik.setFieldValue('amount', 0);
  };

  useEffect(() => {
    setSubmitDisabled(!(formik.isValid && formik.dirty));
  }, [amount, address, setSubmitDisabled, formik.isValid, formik.dirty]);

  useEffect(() => {
    refreshProposal();
  }, [address, identifier, amount]);

  const selector = useMemo(
    () => createDeepEqualSelector(accountSelector, (state: StateType) => getTokenPhotoById(state, identifier)),
    [identifier]);

  const {
    tokenAmount,
    prettyIdentifier,
  } = useSelector<StateType, OrganizationToken>(selector);

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

        <Styled.AmountWithTokenSelectionBox
          className={amountError != null ? 'invalid' : ''}
        >
          <NumericFormat
            name="amount"
            id="amount"
            thousandSeparator
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={addressError != null ? 'isError' : ''}
            style={{
              width: '100%',
              borderRadius: 10,
              background: 'transparent',
              border: 'none',
              flex: '1',
            }}
          />

          <label htmlFor={amount} className={amountError != null ? 'isError' : ''}>
            {`${t('Amount')}`}
          </label>

          <Styled.TokenSelection
            value={identifier ?? ''}
            fullWidth
            label="Identifier"
            size="small"
            className={amountError != null ? 'invalid' : ''}
            MenuProps={{ className: identifier === 'EGLD' ? 'SendTokenListOpened' : 'SendTokenListOpenedWithoutEGLD' }}
            onChange={onIdentifierChanged as any}
          >
            {tokenTableRows?.map((token: TokenTableRowItem) => (
              <MenuItem
                key={token.identifier}
                value={token.identifier}
                sx={{ width: '230px', pl: '.1rem', pr: '.3rem' }}
              >
                <TokenPresentationWithPrice
                  identifier={token.identifier as string}
                />
              </MenuItem>
            ))}
          </Styled.TokenSelection>

          <span className="errorMessage">{amountError}</span>

          <Text
            fontSize={13}
            variant="subtitle2"
            className="availableAmount"
          >{`${t('Available')}: ${tokenAmount} ${prettyIdentifier}`}
          </Text>
        </Styled.AmountWithTokenSelectionBox>
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
