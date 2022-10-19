import { TextField } from '@mui/material';
import { useTheme } from 'styled-components';
import { FormikRoundedCheckBox, InputWrapper } from 'src/components/Theme/StyledComponents';

interface FormikInputFieldPropsType {
  label: string;
  name: string;
  value: any;
  error?: string | boolean | string[];
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
  const theme: any = useTheme();
  return (
    <div>
      <InputWrapper className={error != null ? 'input-wrapper invalid' : 'input-wrapper'}>
        <TextField
          variant="outlined"
          label={label}
          id={name}
          value={value}
          name={name}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          className={className}
          sx={{
            width: '100%',
            transition: 'margin-bottom .3s linear',
            label: {
              marginBottom: 0,
              fontSize: '15px',
              left: '-1px',
              color: theme.palette.text.secondary,
            },
            fieldset: {
              transition: 'all .3s linear',
              borderColor: theme.palette.borders.secondary,
            },
            '& .MuiOutlinedInput-input': {
              color: theme.palette.text.primary,
            },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.borders.active,
              },
            },
            '&.isError': {
              label: {
                color: '#e51a3e !important',
              },
              fieldset: {
                borderColor: '#e51a3e !important',
              },
              '& .MuiOutlinedInput-input': {
                color: '#fff',
              },
              '& .MuiOutlinedInput-root + .MuiFormHelperText-root': {
                color: '#e51a3e !important',
                m: '1px 0 0 4px',
              },
            },
            '&:hover fieldset': {
              borderColor: theme.palette.borders.active,
            },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              color: '#fff',
              borderColor: theme.palette.borders.active,
              borderWidth: '1px',
            },
            '& label.MuiInputLabel-root.Mui-focused': {
              color: theme.palette.borders.active,
            },
          }}
        />
        <span className="errorMessage">{error}</span>
      </InputWrapper>
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
    <FormikRoundedCheckBox>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={handleChange}
      />
      <label className="form-check-label" htmlFor="upgradeableCheckBox">
        {label}
      </label>
    </FormikRoundedCheckBox>
  );
}
