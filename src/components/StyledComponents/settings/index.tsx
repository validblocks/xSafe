import { TextField } from '@mui/material';
import styled from 'styled-components';

export const SettingsInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor: theme.palette.borders.secondary,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.borders.active,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.borders.active,
    },
  },
  '& .Mui-disabled': {
    WebkitTextFillColor: '#6c757d',
    '& fieldset': {
      borderColor: `${theme.palette.borders.secondary} !important`,
    },
  },
  '& .MuiInputLabel-root,& .MuiInputLabel-formControl': {
    color: theme.palette.text.primary,
    zIndex: 0,
  },
  '&&': {
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
}));

export const MultisigAutocomplete = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor: theme.palette.borders.secondary,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.borders.active,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.borders.active,
    },
  },
  '& .MuiInputLabel-root,& .MuiInputLabel-formControl': {
    color: theme.palette.text.primary,
  },
}));
