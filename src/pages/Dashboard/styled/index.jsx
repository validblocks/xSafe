import { Button } from '@mui/material';
import styled from 'styled-components';

export const LoadSafeButton = styled(Button)`
&&& {
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  padding: 23px 24px 19px;
  color: ${(props) => props.theme.palette.secondary.main};
  border-radius: 0;
  border-top: solid 1px rgba(76, 47, 252, 0.03);
  transition: all 300ms linear;
  &:hover {
    color: ${(props) => props.theme.palette.primary.main};
    background-color: #ded9ff;
  };
}
`;

export const CreateNewSafeButton = styled(LoadSafeButton)`
&&& {
  color: #fff;
  background: ${(props) => props.theme.palette.background.button};
  &:hover {
    background-color: ${(props) => props.theme.palette.background.button};
    border-color: ${(props) => props.theme.palette.background.button};
    color: ${(props) => props.theme.palette.background.white};
  };
}
`;
