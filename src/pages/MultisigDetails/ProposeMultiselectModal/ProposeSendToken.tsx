import { useEffect, useMemo, useState } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { Box, MenuItem, SelectChangeEvent } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Form } from 'react-bootstrap';
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
import ActionDialog from 'src/components/Utils/ActionDialog';
import { ProposalsTypes } from 'src/types/Proposals';
import { setProposeMultiselectSelectedOption, setSelectedTokenToSend } from 'src/redux/slices/modalsSlice';
import { InputsContainer, TokenSelect } from 'src/components/Theme/StyledComponents';
import { Text } from 'src/components/StyledComponents/StyledComponents';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken) => void;
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
}

const ProposeSendToken = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendTokenType) => {
  const { t } = useTranslation();
  let formik: FormikProps<IFormValues>;

  const dispatch = useDispatch();

  const handleOptionSelected = (
    option: ProposalsTypes,
  ) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
  };

  const selectedToken = useSelector(selectedTokenToSendSelector);
  const [identifier, setIdentifier] = useState(selectedToken?.identifier);
  const tokenTableRows = useSelector<StateType, TokenTableRowItem[]>(tokenTableRowsSelector);

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
    const newAmount = Number(value);
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
        address: Yup.string()
          .min(2, 'Too Short!')
          .max(500, 'Too Long!')
          .required('Required')
          .test(validateRecipient),
        amount: Yup.string()
          .required('Required')
          .transform((value) => value.replace(',', '.'))
          .test(validateAmount),
      }),
    [validateAmount, validateRecipient],
  );

  formik = useFormik({
    initialValues: {
      address: '',
      amount: 1,
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { touched, errors, values } = formik;
  const { amount, address } = values;

  const getProposal = (): MultisigSendToken | null => {
    try {
      const nominatedAmount = operations.nominate(
        amount.toString(),
        denomination,
      );
      const amountNumeric = Number(nominatedAmount);
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
      const proposal = getProposal();

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const amountError = touched.amount && errors.amount;
  const addressError = touched.address && errors.address;
  const [isSendEgldPromptOpen, setIsSendEgldPromptOpen] = useState(false);
  const [isTokenTableRowsContainsOnlyEGLD, setIsTokenTableRowsCongtainsOnlyEGLD] = useState(false);

  const handleTokenTableRowsContainsOnlyEGLD = () => setIsTokenTableRowsCongtainsOnlyEGLD(!(tokenTableRows.some((item) => item.identifier !== 'EGLD')));

  useEffect(() => {
    handleTokenTableRowsContainsOnlyEGLD();
    if (!selectedToken?.identifier) {
      const firstDifferentThanEgld = tokenTableRows.find((item) => item.identifier !== 'EGLD');
      if (!firstDifferentThanEgld) {
        setIdentifier('EGLD');
        setIsSendEgldPromptOpen(true);
      }

      setIdentifier(firstDifferentThanEgld?.identifier);
      dispatch(
        setSelectedTokenToSend({
          id: firstDifferentThanEgld?.identifier,
          identifier: firstDifferentThanEgld?.identifier,
          balance: firstDifferentThanEgld?.balance,
        }),
      );
    }
  }, [dispatch, identifier, tokenTableRows]);

  const onIdentifierChanged = (event: SelectChangeEvent) => {
    const newIdentifier = event.target.value;
    if (newIdentifier === 'EGLD') {
      setIsSendEgldPromptOpen(true);
    }
    setIdentifier(event.target.value as string);
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
  } = useSelector<StateType, OrganizationToken>(selector);

  return (
    <Box sx={{ p: '1.93rem 2.5rem .3rem' }}>
      <FormikInputField
        label={t('Send to')}
        name="address"
        value={address}
        error={addressError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={addressError != null ? 'isError' : ''}
      />

      <InputsContainer
        className={amountError != null ? 'invalid' : ''}
        sx={{ mb: '30px !important', '&.invalid': { mb: '36px !important' } }}
      >
        <Form.Control
          id={amount}
          name="amount"
          isInvalid={amountError != null}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={amount}
        />

        <label htmlFor={amount}>
          {`${t('Amount')}`}
        </label>

        <TokenSelect
          value={identifier ?? ''}
          fullWidth
          label="Identifier"
          size="small"
          MenuProps={{ className: 'SendTokenListOpened' }}
          onChange={onIdentifierChanged as any}
          sx={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            height: '56px',
            width: '145px',
            border: 'solid 1px rgba(76, 47, 252, 0.23)',
            borderTopLeftRadius: '2rem',
            borderBottomLeftRadius: '2rem',
            fieldset: {
              border: 'none',
            },
            '.MuiSelect-select': {
              py: '.2rem',
              pl: '.1rem',
              '& div.MuiBox-root > div.MuiBox-root:nth-child(3)': {
                display: 'none',
              },
            },
          }}
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
        </TokenSelect>

        <span className="errorMessage">{amountError}</span>

        <Text
          fontSize={13}
          variant="subtitle2"
          className="availableAmount"
        >{`${t('Available')}: ${tokenAmount} EGLD`}
        </Text>
      </InputsContainer>

      <ActionDialog
        showButton={false}
        isOpen={isSendEgldPromptOpen}
        dialogTitle={'Are you sure you want to change the proposal type to "Send EGLD" ?'}
        dialogContent={'Sending EGLD needs different transaction parameters. This will change the proposal type to "Send EGLD" and will remove the amount from the proposal. Are you sure you want to do this?'}
        onActionAccepted={() => handleOptionSelected(ProposalsTypes.send_egld)}
        onActionRejected={() => {
          handleOptionSelected(ProposalsTypes.send_token);
          setIsSendEgldPromptOpen(false);
          const firstDifferentIdentifier = tokenTableRows
            ?.find((token: TokenTableRowItem) => token.identifier !== 'EGLD')?.identifier;
          setIdentifier(firstDifferentIdentifier);
        }}
        onActionTokenTableRows={isTokenTableRowsContainsOnlyEGLD}
      />
    </Box>
  );
};

export default ProposeSendToken;
