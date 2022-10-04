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
    backgroundColor: theme.palette.background.secondary,
    color: theme.palette.text.primary,
  },
}));
