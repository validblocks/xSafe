import { Box } from '@mui/material';
import * as StyledRemote from 'src/pages/MultisigDetails/ProposeMultiselectModal/styled';
import { useTranslation } from 'react-i18next';
import { MaxSendEGLDButton } from 'src/components/Theme/StyledComponents';
import { NumericFormat } from 'react-number-format';
import { useCallback } from 'react';
import { organizationTokenByIdentifierSelector } from 'src/redux/selectors/accountSelector';
import { useSelector } from 'react-redux';
import { selectedTokenToSendSelector } from 'src/redux/selectors/modalsSelector';
import { FormikProps } from 'formik';
import { useCustomTheme } from 'src/utils/useCustomTheme';
import { Text } from '../StyledComponents/StyledComponents';
import TokenSelection from './TokenSelection';
import TokenPresentationWithPrice from './TokenPresentationWithPrice';

interface IProps {
  handleMaxButtonClick?: () => any;
  handleInputChange: any;
  handleInputBlur: any;
  resetAmount: any;
  amount: string | number;
  amountError: string | false | undefined;
  formik?: FormikProps<any>;
  config?: Partial<{
    withAvailableAmount: boolean;
    withTokenSelection: boolean;
    isEsdtOrEgldRelated: boolean;
  }>;
}

const AmountInputWithTokenSelection = ({
  handleMaxButtonClick,
  handleInputChange,
  handleInputBlur,
  amount,
  amountError,
  resetAmount,
  formik,
  config: { withAvailableAmount, withTokenSelection, isEsdtOrEgldRelated } = {
    withAvailableAmount: true,
    withTokenSelection: true,
    isEsdtOrEgldRelated: true,
  },
}: IProps) => {
  const { t } = useTranslation();
  const theme = useCustomTheme();
  const { identifier = 'EGLD' } = useSelector(selectedTokenToSendSelector);

  const { tokenAmount, prettyIdentifier } = useSelector(
    organizationTokenByIdentifierSelector(identifier),
  );

  const maxButtonClickHandler = useCallback(() => {
    if (handleMaxButtonClick) {
      return handleMaxButtonClick();
    }
    return formik?.setFieldValue('amount', tokenAmount);
  }, [formik, handleMaxButtonClick, tokenAmount]);

  console.log("rerender input")

  return (
    <StyledRemote.AmountWithTokenSelectionBox
      className={amountError != null ? 'invalid' : ''}
      sx={{
        display: 'flex !important',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...(!isEsdtOrEgldRelated ? { padding: '12px 0' } : {}),
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <NumericFormat
          name="amount"
          id="amount"
          value={amount}
          thousandSeparator
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={amountError != null ? 'isError' : ''}
          style={{
            width: '100%',
            borderRadius: 10,
            background: 'transparent',
            border: 'none',
            flex: '1',
          }}
        />
        <label
          htmlFor={amount.toString()}
          className={amountError != null ? 'isError' : ''}
        >
          {`${t('Amount')}`}
        </label>
      </Box>
      <Box padding="0 12px 0 1rem">
        <MaxSendEGLDButton onClick={maxButtonClickHandler}>
          Max
        </MaxSendEGLDButton>
      </Box>
      {isEsdtOrEgldRelated && (
        <Box>
          {withTokenSelection ? (
            <Box minWidth="160px">
              <TokenSelection
                amountError={amountError}
                resetAmount={resetAmount}
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
      <span className="errorMessage">{amountError}</span>
      {withAvailableAmount && (
        <Text fontSize={13} variant="subtitle2" className="availableAmount">
          {`${t('Available')}: ${tokenAmount} ${prettyIdentifier}`}
        </Text>
      )}
    </StyledRemote.AmountWithTokenSelectionBox>
  );
};

export default AmountInputWithTokenSelection;
