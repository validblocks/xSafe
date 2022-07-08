import { Box, Button } from '@mui/material';
import styled from 'styled-components';

export const MainButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
