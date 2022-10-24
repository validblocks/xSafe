import { Box, Button } from '@mui/material';
import styled from 'styled-components';

export const SafeOptionsWrapper = styled(Box)`
  position: absolute;
  top: 7px;
  left: 235px;
  background: ${(props) => props.theme.palette.background.white};
  box-shadow: 0px 0px 24px
    ${(props) => props.theme.shadows.secondary};
  border-radius: ${(props) => props.theme.shape.radius};
  z-index: 2;
  width: 240px;
  overflow: hidden;
`;

export const AddSafe = styled(Button)`
&&& {
  width: 100%;
  padding:
          ${(props) => props.theme.padding.value.md}
          ${(props) => props.theme.padding.value.sm}
          ${(props) => props.theme.padding.value.sm}
          ${(props) => props.theme.padding.value.md};
  border-radius: 0;
  justify-content: flex-start;
  text-align: left;
  text-transform: none;
  font-size: 14px;
  color: ${(props) => props.theme.palette.primary.main};
  &:hover {
    background-color: ${(props) => props.theme.palette.background.purple}
  }
  svg {
    margin: 0 4px 2px 0;
    width: 28px;
    height: 28px;
    fill: ${(props) => props.theme.palette.secondary.main};
  }
}
`;

export const InactiveWallet = styled(Box)`
  color: ${(props) => props.theme.palette.black.main};
  opacity: 0.5;
`;

export const ActiveWallet = styled(Box)`
  color: ${(props) => props.theme.palette.black.main};
`;
