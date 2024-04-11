import { Box } from '@mui/material';
import styled from 'styled-components';

export const ConnectedAccountDetailsContainer = styled(Box)(({ theme: _ }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flex: 1,
  gap: '1rem',
  paddingLeft: '1rem',
}));
