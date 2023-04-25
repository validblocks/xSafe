import { Chip } from '@mui/material';
import styled from 'styled-components';

export const BasicChip = styled(Chip)(({ theme }) => ({
  '&&&': {
    backgroundColor: theme.palette.background.disabled,
    color: theme.palette.text.primary,
    marginRight: '4px',
  },
}));
