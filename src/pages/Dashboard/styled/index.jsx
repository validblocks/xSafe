import { Button } from '@mui/material';
import styled from 'styled-components';

export const LoadSafeButton = styled(Button)`
&&& {
  box-sizing: border-box;
  padding: 23px 24px 19px;
  color: ${(props) => props.theme.palette.secondary.main};
  border-radius: 0;
  border-top: solid 1px rgba(76, 47, 252, 0.03);
  transition: all 300ms linear;
  margin-top: 12px;
  width: 100%;
  height: 60px;
  &:hover {
    color: ${(props) => props.theme.palette.primary.main};
    background-color: #ded9ff;
  };
}
`;

export const CreateNewSafeButton = styled(LoadSafeButton)`
&&& {
  color: ${(props) => props.theme.palette.background.secondary};
  background: ${(props) => props.theme.palette.primary.main};
  height: 60px;
  &:hover {
    color: ${(props) => props.theme.palette.background.secondary};
    background: ${(props) => props.theme.palette.primary.main};
  };
}
`;
