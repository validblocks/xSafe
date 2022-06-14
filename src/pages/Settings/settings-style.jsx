import { Box } from '@mui/material';
import styled from 'styled-components';

export const Span = styled.span`
  font-weight: ${(props) => {
    return props.theme.typography.bold;
  }};
`;

export const SettingsWrapper = styled(Box)`
  background-color: ${(props) => {
    return props.theme.palette.background.white;
  }};
  border-radius: ${(props) => {
    return props.theme.shape.radius;
  }};
  width: 55%;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const NoteSpan = styled.span`
  background-color: ${(props) => {
    return props.theme.palette.background.main;
  }};
  padding: 5px 10px;
  line-height: 2.5;
  border-radius: ${(props) => {
    return props.theme.shape.radius;
  }};
`;
