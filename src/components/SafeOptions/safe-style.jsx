import { Box, Button } from '@mui/material';
import styled from 'styled-components';

export const SafeOptionsWrapper = styled(Box)`
  position: absolute;
  left: 7px;
  background: ${(props) => props.theme.palette.background.white};
  box-shadow: 0px 0px 24px
    ${(props) => props.theme.shadows.secondary};
  border-radius: ${(props) => props.theme.shape.radius};
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
  color: ${(props) => props.theme.palette.primary.main};
`;

export const InactiveWallet = styled(Box)`
  color: ${(props) => props.theme.palette.black.main};
  opacity: 0.5;
`;

export const ActiveWallet = styled(Box)`
  color: ${(props) => props.theme.palette.black.main};
`;
