import { MenuItem } from '@mui/material';
import Form from 'react-bootstrap/Form';
import { useCallback } from 'react';
import { InputsContainer, MaxSendEGLDButton } from '../Theme/StyledComponents';
import { Text } from '../StyledComponents/StyledComponents';
import TokenPresentationWithPrice from './TokenPresentationWithPrice';

const InputTokenPresentation = ({
  amount, amountError, egldBalanceString, label, onChange, onBlur, formik, id }:
  { amount: string, amountError: string | false | undefined, egldBalanceString: any, label: string, onChange: any, onBlur: any, formik: any, id?: string }) => {
  const egldBalanceNumber = Number(egldBalanceString);

  const autocompleteMaxAmount = useCallback(() => {
    if (amountError) {
      return;
    }
    formik.setFieldValue('amount', egldBalanceNumber);
  }, [amountError, egldBalanceNumber, formik]);

  return (
    <InputsContainer
      className={amountError != null ? 'hasAvailableAmount invalid' : 'hasAvailableAmount'}
    >
      <Form.Control
        id={id}
        name="amount"
        isInvalid={amountError != null}
        onChange={onChange}
        onBlur={onBlur}
        value={amount}
      />

      <label htmlFor={id}>
        {label}
      </label>

      <MaxSendEGLDButton disabled={amountError != null} onClick={autocompleteMaxAmount}>
        Max
      </MaxSendEGLDButton>

      <MenuItem
        key={'EGLD'}
        value={'EGLD'}
        sx={{ p: '.25rem .4rem' }}
      >
        <TokenPresentationWithPrice
          withTokenAmount={false}
          withTokenValue={false}
          identifier={'EGLD'}
        />
      </MenuItem>

      <span className="errorMessage">{amountError}</span>

      <Text
        fontSize={13}
        variant="subtitle2"
        sx={{ marginTop: '.35rem !important' }}
        className="availableAmount"
      >{`${'Available'}: ${egldBalanceString} EGLD`}
      </Text>

    </InputsContainer>
  );
};

export default InputTokenPresentation;
