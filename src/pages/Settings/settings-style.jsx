import { Box } from '@mui/material';
import styled from 'styled-components';

export const Span = styled.span`
  font-weight: ${(props) => props.theme.typography.bold};
`;

export const SettingsWrapper = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.secondary};
  color: ${(props) => props.theme.palette.text.primary};
  border-radius: ${(props) => props.theme.shape.radius};
  padding: 24px;
  @media (max-width: 600px) {
    width: 100%;
    padding: 16px;
  }
`;

export const NoteSpan = styled(Box)(({ theme: _ }) => ({
  backgroundColor: _.palette.background.main,
  padding: '5px 10px',
  lineHeight: 1.4,
  borderRadius: _.shape.radius,
  display: 'table',
  color: _.palette.text.primary,
}));
