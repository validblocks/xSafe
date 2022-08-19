import { MenuItem } from '@mui/material';
import Form from 'react-bootstrap/Form';
import { InputsContainer, MaxSendEGLDButton } from '../Theme/StyledComponents';
import { Text } from '../StyledComponents/StyledComponents';
import TokenPresentationWithPrice from './TokenPresentationWithPrice';

const InputTokenPresentation = ({
  amount, amountError, egldBalanceString, label, formikChange, formikBlur, onClick }:
  { amount: any, amountError: any, egldBalanceString: any, label: any, formikChange: any, formikBlur: any, onClick: any }) => (
    <InputsContainer>
      <Form.Control
        id={amount}
        name="amount"
        isInvalid={amountError != null}
        onChange={formikChange}
        onBlur={formikBlur}
        value={amount}
      />

      <label htmlFor={amount}>
        {label}
      </label>

      <MaxSendEGLDButton onClick={onClick}>
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

export default InputTokenPresentation;
