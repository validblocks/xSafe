import * as Yup from 'yup';
import { TestContext } from 'yup';
import { Box } from '@mui/material';
import * as StyledRemote from 'src/components/MultisigDetails/ProposeMultiselectModal/styled';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { MaxSendEGLDButton } from 'src/components/Theme/StyledComponents';
import { NumericFormat } from 'react-number-format';
import { useCallback, useEffect } from 'react';
import { FormikProps, useFormik } from 'formik';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import TokenSelection from './TokenSelection';
import TokenPresentationWithPrice from './TokenPresentationWithPrice';
import { useTokenToSendDetails } from 'src/hooks/useTokenToSendDetails';
import DisplayAvailableBalance from './DisplayAvailableBalance';

type Params = any;

export interface IAmountInputProps {
  initialAmount?: string;
  minAmountAllowed?: string;
  maxValue?: string;
  config: Partial<{
    withAvailableAmount: boolean;
    withTokenSelection: boolean;
    isEsdtOrEgldRelated: boolean;
  }>;
  onAmountError?: (amountErrors?: string) => void;
  onAmountChange?: (amount: string) => void;
  onResetAmount?: (params?: Params) => void;
  onAmountIsNaN?: (params?: Params) => void;
  onAmountIsZero?: (params?: Params) => void;
  onMaxButtonClick?: (params?: Params) => void;
  onAmountIsLessThanAllowed?: (params?: Params) => void;
  onAmountIsBiggerThanBalance?: (params?: Params) => void;
  onSuccessfulAmountValidation?: (params?: Params) => void;
  onAmountErrorAfterTouch?: (amountErrorsAfterTouch?: string) => void;
  onInputBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customAmountValidation?: (unparsedAmountString?: string) => {
    isValid: boolean;
    errorMessage: string | null;
  };
}

interface IFormValues {
  amount: string;
}

const AmountInputWithTokenSelection = ({
  onMaxButtonClick,
  onInputChange,
  onInputBlur,
  onAmountIsNaN,
  onAmountIsZero,
  onAmountIsBiggerThanBalance,
  onAmountIsLessThanAllowed,
  onSuccessfulAmountValidation,
  onResetAmount,
  onAmountError,
  onAmountChange,
  onAmountErrorAfterTouch,
  customAmountValidation,
  minAmountAllowed = '0',
  initialAmount = '0',
  maxValue,
  config: {
    withAvailableAmount = true,
    withTokenSelection = true,
    isEsdtOrEgldRelated = true,
  } = {
    withAvailableAmount: true,
    withTokenSelection: true,
    isEsdtOrEgldRelated: true,
  },
}: IAmountInputProps) => {
  const t = useCustomTranslation();
  const theme = useCustomTheme();

  const { prettyIdentifier, balance, decimals } = useTokenToSendDetails();

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      amount: initialAmount ?? minAmountAllowed ?? '0',
    },
    onSubmit: () => Promise.resolve(null),
    validationSchema: Yup.object().shape({
      amount: Yup.string()
        .required('Required')
        .transform((value) => value.replace(',', ''))
        .test('decimals', `Maximum ${decimals} decimals allowed`, (value) => {
          const parts = value?.split('.');
          if (parts?.length === 2) {
            return parts[1].length <= decimals;
          }
          return true;
        })
        .test((value?: string, testContext?: TestContext) => {
          const newAmount = Number(value);
          const isNotANumber = Number.isNaN(newAmount);
          if (isNotANumber) {
            onAmountIsNaN?.();
            return (
              testContext?.createError({
                message: 'Invalid amount',
              }) ?? false
            );
          }

          const isAmountLessThanAllowed = newAmount < Number(minAmountAllowed);
          if (isAmountLessThanAllowed) {
            onAmountIsLessThanAllowed?.();
            formik.setFieldValue('amount', minAmountAllowed);
          }

          if (newAmount === 0) {
            onAmountIsZero?.();
          }

          const maxValueAllowed = maxValue ? maxValue : balance;
          const isAmountBiggerThanBalance = newAmount > Number(maxValueAllowed);

          if (isAmountBiggerThanBalance) {
            onAmountIsBiggerThanBalance?.();
            return (
              testContext?.createError({
                message: t('Insufficient funds'),
              }) ?? false
            );
          }

          const customValidationResult = customAmountValidation?.(value);
          const errorMessage = customValidationResult?.errorMessage;

          if (errorMessage) {
            return (
              testContext?.createError({
                message: errorMessage,
              }) ?? false
            );
          }

          formik.setFieldError('amount', undefined);
          onSuccessfulAmountValidation?.();
          return true;
        }),
    }),
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
  });

  const { touched, errors, values } = formik;
  const { amount } = values;

  const hasAmountErrors = !!errors.amount;
  const hasAmountErrorsAfterTouch = touched?.amount && errors.amount;

  useEffect(() => {
    if (hasAmountErrorsAfterTouch) {
      onAmountErrorAfterTouch?.(errors.amount);
      onAmountError?.(errors.amount);
    } else if (errors.amount) {
      onAmountError?.(errors.amount);
    }
  }, [
    hasAmountErrors,
    hasAmountErrorsAfterTouch,
    errors.amount,
    onAmountError,
    onAmountErrorAfterTouch,
  ]);

  useEffect(() => {
    onAmountChange?.(amount);
  }, [amount]);

  const handleMaxButtonClick = useCallback(() => {
    onMaxButtonClick?.();

    formik?.setFieldValue('amount', maxValue ?? balance);
  }, [formik, maxValue, onMaxButtonClick, balance]);

  const handleResetAmount = useCallback(() => {
    formik.setFieldValue('amount', minAmountAllowed);
    onResetAmount?.();
  }, [formik, minAmountAllowed, onResetAmount]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
      onInputChange?.(e);
    },
    [formik, onInputChange],
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      formik.handleBlur(e);
      onInputBlur?.(e);
    },
    [formik, onInputBlur],
  );

  return (
    <StyledRemote.AmountWithTokenSelectionBox
      className={hasAmountErrors ? 'invalid' : ''}
      sx={{
        display: 'flex !important',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...(!isEsdtOrEgldRelated ? { padding: '12px 0' } : {}),
      }}
      data-testid="aiwts-amount-with-token-selection-box"
    >
      <Box sx={{ flexGrow: 1 }}>
        <NumericFormat
          name="amount"
          id="amount"
          data-testid="aiwts-numeric-format-input"
          value={amount}
          thousandSeparator
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={hasAmountErrors ? 'isError' : ''}
          style={{
            width: '100%',
            borderRadius: 10,
            background: 'transparent',
            border: 'none',
            flex: '1',
          }}
        />
        <label
          htmlFor={amount?.toString()}
          className={hasAmountErrors ? 'isError' : ''}
          data-testid="aiwts-amount-label"
        >
          {`${t('Amount')}`}
        </label>
      </Box>
      <Box padding="0 12px 0 1rem">
        <MaxSendEGLDButton
          onClick={handleMaxButtonClick}
          data-testid="aiwts-max-button"
        >
          Max
        </MaxSendEGLDButton>
      </Box>
      {isEsdtOrEgldRelated && (
        <Box>
          {withTokenSelection ? (
            <Box minWidth="160px" data-testid="aiwts-token-selection">
              <TokenSelection
                amountError={errors.amount}
                resetAmount={handleResetAmount}
              />
            </Box>
          ) : (
            <Box
              className="egld-staked"
              sx={{
                borderLeft: `1px solid ${theme.palette.borders.secondary}`,
                borderTopLeftRadius: '5rem',
                borderBottomLeftRadius: '5rem',
                transition: 'all 0.3s linear',
                padding: '10px',
                ':hover': {
                  borderLeft: `1px solid ${theme.palette.borders.active}`,
                },
              }}
            >
              <TokenPresentationWithPrice
                identifier="EGLD"
                withTokenAmount={false}
                withTokenValue={false}
              />
            </Box>
          )}
        </Box>
      )}
      <span className="errorMessage" data-testid="aiwts-amount-error">
        {errors.amount}
      </span>
      {withAvailableAmount && (
        <DisplayAvailableBalance
          availableBalance={balance}
          prettyIdentifier={prettyIdentifier}
        />
      )}
    </StyledRemote.AmountWithTokenSelectionBox>
  );
};
export default AmountInputWithTokenSelection;
