import { Box, Button, Typography } from '@mui/material';
import styled from 'styled-components';

export const MainButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.palette.text.primary}
`;

export const PerformActionButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.secondary.main} !important;
  padding: 10px;
  font-size: 14px;
  text-transform: none;
  &:hover {
    background-color: ${(props) => props.theme.palette.background.button};
    border-color: ${(props) => props.theme.palette.background.button};
    color: ${(props) => props.theme.palette.background.white};
  }
`;

export const DiscardActionButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background: transparent !important;
  color: ${(props) => props.theme.palette.danger.main} !important;
  padding: 0.5rem 1rem !important;
  border: 1px solid ${(props) => props.theme.palette.danger.main} !important;
  &:hover {
    background: ${(props) => props.theme.palette.background.danger} !important;
    border: 1px solid ${(props) => props.theme.palette.danger.main} !important;
    box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main} !important;
  }
`;

export const MultisigCard = styled(Box)`
  width: 240px;
  padding: 15px;
  margin: 0 12px 12px 0;
  background: ${(props) => props.theme.palette.background.secondary};
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03);
  border: none;
`;

export const Text = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-family: 'IBM Plex Sans', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace !important;
`;

export const ModalCardTitleContainer = styled(Box)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider.secondary};
  background-color: ${(props) => props.theme.palette.background.secondary};
  border-radius: 10px 10px 0 0;
  padding: 1.5rem 3rem;
  & .MuiButtonBase-root {
    &:hover {
      background-color: ${(props) => props.theme.palette.hover.secondary};
    },
  }
`;
