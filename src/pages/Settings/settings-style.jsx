import { Box } from '@mui/material';
import styled from 'styled-components';

export const Span = styled.span`
  font-weight: ${(props) => {
    return props.theme.palette.typography.bold;
  }};
`;

export const SettingsWrapper = styled(Box)`
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};
  border-radius: ${(props) => {
    return props.theme.palette.radius.main;
  }};
  width: 55%;
`;

export const NoteSpan = styled.span`
  background-color: ${(props) => {
    return props.theme.palette.background.main;
  }};
  padding: 5px 10px;
  border-radius: ${(props) => {
    return props.theme.palette.radius.main;
  }};
`;
