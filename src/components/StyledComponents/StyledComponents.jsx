import { Box, Button } from '@mui/material';
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
