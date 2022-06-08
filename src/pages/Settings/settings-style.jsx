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
  @media (max-width: 1200px) {
    width: 100%;
  }
  width: 55%;
`;

export const NoteSpan = styled.span`
  line-height: 2.5;
  background-color: ${(props) => {
    return props.theme.palette.background.main;
  }};
  padding: 5px 10px;
  border-radius: ${(props) => {
    return props.theme.shape.radius;
  }};
`;
