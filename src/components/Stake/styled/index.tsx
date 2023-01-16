import { Box } from '@mui/material';
import { MobileCardOfTokens } from 'src/pages/Organization/styled';
import styled from 'styled-components';

export const DelegationCardContainer = styled(MobileCardOfTokens)(({ theme: _ }) => ({
  width: 'auto !important',
  alignItems: 'stretch',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}));

export const DelegationInfoBox = styled(Box)(({ theme: _ }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(76, 47, 252, 0.1)',
  borderRadius: '10px',
  border: '1px solid  #312870',
  padding: '10px',
}));

export const DelegationInfoContainer = styled(Box)(({ theme: _ }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 3,
  gap: '10px',
}));

export const ActionButtonBox = styled(Box)(({ theme: _ }) => ({
  padding: '5px 0',
  flex: 1,
}));
