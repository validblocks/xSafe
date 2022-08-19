import { MenuItem } from '@mui/material';
import Form from 'react-bootstrap/Form';
import { useCallback } from 'react';
import { InputsContainer, MaxSendEGLDButton } from '../Theme/StyledComponents';
import { Text } from '../StyledComponents/StyledComponents';
import TokenPresentationWithPrice from './TokenPresentationWithPrice';

const InputTokenPresentation = ({
  amount, amountError, egldBalanceString, label, onChange, onBlur, formik }:
  { amount: any, amountError: any, egldBalanceString: any, label: any, onChange: any, onBlur: any, formik: any }) => {
  const egldBalanceNumber = Number(egldBalanceString);

  const autocompleteMaxAmount = useCallback(() => {
    if (amountError) {
      return;
    }
    formik.setFieldValue('amount', egldBalanceNumber);
  }, [amountError, egldBalanceNumber, formik]);

  return (
    <InputsContainer>
      <Form.Control
        id={amount}
        name="amount"
        isInvalid={amountError != null}
        onChange={onChange}
        onBlur={onBlur}
        value={amount}
      />

      <label htmlFor={amount}>
        {label}
      </label>

      <MaxSendEGLDButton onClick={autocompleteMaxAmount}>
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

      <Text
        fontSize={13}
        variant="subtitle2"
        sx={{ marginTop: '.35rem !important' }}
        className="availableAmount"
      >{`${'Available'}: ${egldBalanceString} EGLD`}
      </Text>

      {amountError != null && (
      <Form.Control.Feedback type="invalid">
        {amountError}
      </Form.Control.Feedback>
      )}
    </InputsContainer>
  );
};

export default InputTokenPresentation;
