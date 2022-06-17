import React from 'react';
import Form from 'react-bootstrap/Form';

interface FormikInputFieldPropsType {
  label: string;
  name: string;
  value: any;
  error?: string | boolean;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  as?: any;
  footer?: React.ReactElement;
}

interface FormikCheckboxPropsType {
  label: string;
  name: string;
  checked: boolean;
  handleChange?: (e: any) => void;
  footer?: React.ReactElement;
}

export const FormikInputField = ({
  label,
  name,
  value,
  error,
  handleChange,
  handleBlur,
  footer,
  as = 'input',
}: FormikInputFieldPropsType) => (
  <div className="modal-control-container">
    <div className="input-wrapper">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <Form.Control
        id={name}
        name={name}
        type="text"
        as={as}
        isInvalid={error != null}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
      />
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </div>
    {footer != null && footer}
  </div>
);

export const FormikCheckbox = ({
  label,
  name,
  checked,
  handleChange,
}: FormikCheckboxPropsType) => (
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
