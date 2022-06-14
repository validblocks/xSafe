import { Button } from '@mui/material';
import styled from 'styled-components';

export const MainButton = styled(Button)`
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background-color: var(--primary-background);
  box-shadow: 0px 0px 8px var(--primary-shadow);
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
