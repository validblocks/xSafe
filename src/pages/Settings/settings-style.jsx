import { Box } from '@mui/material';
import styled from 'styled-components';

export const Span = styled.span`
  font-weight: ${(props) => props.theme.typography.bold};
`;

export const SettingsWrapper = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.secondary};
  color: ${(props) => props.theme.palette.text.primary};
  border-radius: ${(props) => props.theme.shape.radius};
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const NoteSpan = styled.span`
  background-color: ${(props) => props.theme.palette.background.main};
  padding: 5px 10px;
  line-height: 2.5;
  border-radius: ${(props) => props.theme.shape.radius};
`;
