import { Autocomplete, autocompleteClasses, Box, Popper } from '@mui/material';
import styled from 'styled-components';

export const ContainerWithPanelsTopBox = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    width: '100%',
    padding: '0 1rem',
  },
}));

export const TabContainerBox = styled(Box)(({ theme }) => ({
  '&&&': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `2px solid ${theme.palette.divider.main} !important`,
  },
}));

export const MultisigAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '&&&': {
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
      '& .MuiAutocomplete-endAdornment': {
        '& button': {
          '& svg': {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    '& .MuiInputLabel-root,& .MuiInputLabel-formControl': {
      color: theme.palette.text.primary,
    },
    '& .MuiAutocomplete-popper': {
      color: theme.palette.text.primary,
    },
  },
}));

export const MultisigPopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.secondary,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.background.secondary}`,
    boxShadow: 'none',
  },
}));
