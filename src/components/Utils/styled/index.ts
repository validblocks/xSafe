import { Autocomplete, Box } from '@mui/material';
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
    },
    '& .MuiInputLabel-root,& .MuiInputLabel-formControl': {
      color: theme.palette.text.primary,
    },
  },
}));
