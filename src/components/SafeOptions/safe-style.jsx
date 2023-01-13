import { Box, Button } from '@mui/material';
import styled from 'styled-components';

export const SafeOptionsOverlay = styled(Box)(({ theme: _ }) => ({
  '@media (max-width:600px)': {
    position: 'absolute',
    width: '100%',
    height: '100vh',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
}));

export const SafeOptionsWrapper = styled(Box)`
  width: 231px;
  position: absolute;
  top: 7px;
  left: 235px;
  color: ${(props) => props.theme.palette.text.primary};
  background: ${(props) => props.theme.palette.background.safeOptions.main};
  box-shadow: 0px 0px 6px
    ${(props) => props.theme.shadows.secondary};
  border-radius: ${(props) => props.theme.shape.radius};
  z-index: 3;
  overflow: hidden;
  & .MuiDivider-root {
    border-color: ${(props) => props.theme.palette.background.safeOptions.divider};
  }
  @media (max-width:600px){
    width: 100%;
    top: 112px;
    left: 0;
    }
  }
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
    fill: ${(props) => props.theme.palette.background.safeOptions.svg};
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
