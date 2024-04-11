import { Box } from '@mui/material';
import styled from 'styled-components';

export const WarningBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '.5rem 1rem',
  color: theme.palette.text.discardButton,
  border: `1px solid ${theme.palette.danger.main}`,
  borderRadius: '.5rem',
  marginBottom: '1.5rem',
}));
