import { Button, Typography } from '@mui/material';
import styled from 'styled-components';

export const MainButton = styled(Button)`
  color: ${(props) => {
    return props.theme.palette.primary.main;
  }};
  border: 1px solid
    ${(props) => {
      return props.theme.palette.primary.main;
    }};
  background-color: ${(props) => {
    return props.theme.palette.background.main;
  }};
  box-shadow: 0px 0px 8px
    ${(props) => {
      return props.theme.shadows.main;
    }};
`;

export const TypographyBold = styled(Typography)`
  font-weight: ${(props) => {
    return props.theme.typography.bold;
  }};
`;
