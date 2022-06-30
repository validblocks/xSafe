import { Box, Button } from '@mui/material';
import styled from 'styled-components';

export const SafeOptionsWrapper = styled(Box)`
  position: absolute;
  margin-left: -181px;
  background: ${(props) => {
    return props.theme.palette.background.white;
  }};
  box-shadow: 0px 0px 24px
    ${(props) => {
      return props.theme.shadows.secondary;
    }};
  border-radius: ${(props) => {
    return props.theme.shape.radius;
  }};
  z-index: 2;
  width: 240px;
`;

export const AddSafeWrapper = styled(Box)`
  text-align: left;
`;

export const AddSafe = styled(Button)`
  text-align: left;
  text-transform: capitalize;
  font-size: 14px;
  color: ${(props) => {
    return props.theme.palette.primary.main;
  }};
`;

export const InactiveWallet = styled(Box)`
  color: ${(props) => {
    return props.theme.palette.black.main;
  }};
  opacity: 0.5;
`;

export const ActiveWallet = styled(Box)`
  color: ${(props) => {
    return props.theme.palette.black.main;
  }};
`;
