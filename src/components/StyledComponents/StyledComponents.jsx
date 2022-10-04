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
`;

export const PerformActionButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background: transparent !important;
  color: ${(props) => props.theme.palette.secondary} !important;
  padding: 0 1rem !important;
  border: 1px solid ${(props) => props.theme.palette.secondary.main} !important;
  &:hover {
    background: ${(props) => props.theme.palette.background.main} !important;
    border: 1px solid ${(props) => props.theme.palette.primary.main} !important;
    box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main} !important;
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
  background: ${(props) => props.theme.palette.background.default};
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03);
  background-color: #fff;
  border: none;
`;

export const Text = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-family: 'IBM Plex Sans', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace !important;
`;

export const ModalCardTitleContainer = styled(Box)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider.main};
  border-radius: 10px 10px 0 0;
  padding: 1.5rem 3rem;

`;
