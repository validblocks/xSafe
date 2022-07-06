import { useEffect, useMemo, useState } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TestContext } from 'yup';
import * as Yup from 'yup';
import { FormikInputField } from 'src/helpers/formikFields';
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
import { selectedTokenToSendSelector } from 'src/redux/selectors/modalsSelector';
import { denomination } from 'src/config';
import { MultisigSendToken } from 'src/types/MultisigSendToken';
import { TokenTableRowItem } from 'src/pages/Organization/types';
import { ReactComponent as ElrondLogo } from 'src/assets/img/logo.svg';

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

const SQUARE_IMAGE_WIDTH = 30;
const DECIMAL_POINTS = 3;

const ProposeSendToken = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendTokenType) => {
  const { t } = useTranslation();
  let formik: any;

  const selectedToken = useSelector(selectedTokenToSendSelector);
  const [identifier, setIdentifier] = useState(selectedToken.identifier);
  const organizationTokens = useSelector(organizationTokensSelector);

  type TokenPresentationProps = {
    photoUrl: string;
    prettyIdentifier: string;
    tokenPrice: string;
    tokenAmount: string;
    tokenValue: string;
  };

  const availableTokens: TokenPresentationProps[] = useMemo(
    () =>
      organizationTokens.map((token: TokenTableRowItem) => ({
        photoUrl: token.balanceDetails?.photoUrl ?? '',
        prettyIdentifier: token.identifier,
        tokenPrice: `$${parseFloat(Number(token.value?.tokenPrice as string).toFixed(DECIMAL_POINTS))}`,
        tokenAmount: `${parseFloat(
          Number(operations.denominate({
            input: token.value?.amount as string,
            denomination: token.balanceDetails?.decimals as number,
            decimals: token.balanceDetails?.decimals as number,
            showLastNonZeroDecimal: true,
          })).toFixed(DECIMAL_POINTS),
        )}`,
        tokenValue: `$${parseFloat(
          Number(Number(operations.denominate({
            input: token.value?.amount as string,
            denomination: token.balanceDetails?.decimals as number,
            decimals: token.balanceDetails?.decimals as number,
            showLastNonZeroDecimal: true,
          })) * (token.value?.tokenPrice as number)).toFixed(DECIMAL_POINTS),
        )}`,
      })),
    [organizationTokens],
  );

  const availableTokensWithBalances = useMemo(
    () =>
      organizationTokens.map((token: TokenTableRowItem) => ({
        identifier: token.identifier,
        balance: operations.denominate({
          input: token?.balanceDetails?.amount as string,
          denomination: token?.balanceDetails?.decimals as number,
          decimals: token?.balanceDetails?.decimals as number,
          showLastNonZeroDecimal: true,
          addCommas: false,
        }),
      })),
    [organizationTokens],
  );

  const selectedTokenBalance = useMemo(
    () =>
      availableTokensWithBalances.find(
        (token: TokenTableRowItem) => token.identifier === identifier,
      )?.balance as string,
    [identifier],
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
            'There are not enough money in the organization for this transaction',
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
      amount: 0,
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

  const onIdentifierChanged = (event: SelectChangeEvent) => {
    setIdentifier(event.target.value as string);
    formik.setFieldValue('amount', 0);
  };

  useEffect(() => {
    setSubmitDisabled(!(formik.isValid && formik.dirty));
  }, [amount, address]);

  useEffect(() => {
    refreshProposal();
  }, [address, identifier, amount]);

  console.log({ here: organizationTokens });

  return (
    <div>
      <div className="modal-control-container mb-4">
        <FormikInputField
          label={t('Send to')}
          name="address"
          value={address}
          error={addressError}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
        />
      </div>
      <div className="modal-control-container mb-4">
        <InputLabel id="demo-simple-select-label">Identifier</InputLabel>
        <Select
          value={identifier}
          fullWidth
          label="Identifier"
          size="small"
          onChange={onIdentifierChanged}
          className="mb-2"
        >
          {availableTokens.map((token: TokenPresentationProps) => (
            <MenuItem
              key={token.prettyIdentifier}
              value={token.prettyIdentifier}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box>
                    {token.prettyIdentifier !== 'EGLD' && (
                    <img
                      width={SQUARE_IMAGE_WIDTH}
                      height={SQUARE_IMAGE_WIDTH}
                      src={token.photoUrl}
                      alt={token.prettyIdentifier}
                      className="mr-3"
                    />
                    )}
                    {token.prettyIdentifier === 'EGLD' && (
                    <ElrondLogo
                      width={SQUARE_IMAGE_WIDTH}
                      height={SQUARE_IMAGE_WIDTH}
                      className="mr-3"
                    />
                    )}
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  >
                    <Box>
                      {token.prettyIdentifier?.split('-')[0]}
                    </Box>
                    <Typography variant="subtitle2">
                      {token.tokenPrice}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Box>
                    {token.tokenAmount}
                  </Box>
                  <Box>
                    {token.tokenValue}
                  </Box>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
        <div>
          Balance:
          {` ${parseFloat(Number(
            availableTokensWithBalances.find(
              (token: TokenTableRowItem) => token.identifier === identifier,
            )?.balance,
          ).toFixed(DECIMAL_POINTS))}`}
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

export default ProposeSendToken;
