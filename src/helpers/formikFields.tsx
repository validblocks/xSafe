import { TextField } from '@mui/material';
import Form from 'react-bootstrap/Form';
import { truncateInTheMiddle } from 'src/utils/addressUtils';

interface FormikInputFieldPropsType {
  label: string;
  name: string;
  value: any;
  error?: string | boolean;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  footer?: React.ReactElement;
  disabled?: boolean;
}

interface FormikCheckboxPropsType {
  label: string;
  name: string;
  checked: boolean;
  handleChange?: (e: any) => void;
}

export function FormikInputField({
  label,
  name,
  value,
  error,
  handleChange,
  handleBlur,
  footer,
  disabled,
}: FormikInputFieldPropsType) {
  return (
    <div>
      <div className="input-wrapper">
        {/* <Form.Control
          id={name}
          name={name}
          type="text"
          as={as}
          isInvalid={error != null}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          disabled={disabled}
        /> */}
        <TextField
          variant="outlined"
          label={label}
          id={name}
          value={truncateInTheMiddle(value, 24)}
          name={name}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={error != null}
          sx={{
            width: '100%',
            '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
              padding: '0.7rem 0.9rem',
            },
            label: {
              marginBottom: 0,
              fontSize: '15px',
              left: '-1px',
            },
          }}
        />
        {error && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}
      </div>
      {footer != null && footer}
    </div>
  );
}

export function FormikCheckbox({
  label,
  name,
  checked,
  handleChange,
}: FormikCheckboxPropsType) {
  return (
    <div className="modal-control-container my-2">
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="upgradeableCheckBox">
          {label}
        </label>
      </div>
    </div>
  );
}
