import { TextField } from '@mui/material';
import Form from 'react-bootstrap/Form';

interface FormikInputFieldPropsType {
  label: string;
  name: string;
  value: any;
  error?: string | boolean;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  footer?: React.ReactElement;
  disabled?: boolean;
  className?: string;
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
  className,
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
          value={value}
          name={name}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={error}
          className={className}
          sx={{
            width: '100%',
            label: {
              marginBottom: 0,
              fontSize: '15px',
              left: '-1px',
              color: '#4c2ffc',
            },
            '&.isError': {
              label: {
                color: '#e51a3e !important',
              },
              fieldset: {
                borderColor: '#e51a3e !important',
              },
              '& .MuiOutlinedInput-root + .MuiFormHelperText-root': {
                color: '#e51a3e !important',
                m: '3.5px 0 0 4px',
              },
            },
            '& .MuiOutlinedInput-root fieldset': {
              borderColor: 'rgba(76, 47, 252, 0.23)',
            },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              borderColor: '#4c2ffc',
            },
            '& label.MuiInputLabel-root.Mui-focused': {
              color: '#4c2ffc',
            },
          }}
        />
        {error != null && (
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
