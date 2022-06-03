import { Button } from '@mui/material';
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
      return props.theme.palette.shadow.main;
    }};
`;
