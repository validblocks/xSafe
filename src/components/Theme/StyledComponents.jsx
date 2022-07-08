import { Button, Typography, Box } from '@mui/material';
import styled from 'styled-components';

export const MainButton = styled(Button)`
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid
    ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px
    ${(props) => props.theme.shadows.main};
  text-transform: capitalize;
  font-weight: ${(props) => props.theme.font.weight.lg};
  padding:
    ${(props) => props.theme.padding.value.sm}
    ${(props) => props.theme.padding.value.lg}
    ${(props) => props.theme.padding.value.xs};
`;

export const AssetActionButton = styled(MainButton)`
  padding: 1px ${(props) => props.theme.padding.value.lg} 0 0;
  transform: scale(0);
`;

export const TypographyBold = styled(Typography)`
  font-weight: ${(props) => props.theme.typography.bold};
`;

export const Main = styled.main`
  background-color: ${(props) => props.theme.palette.background.default};
`;

export const AssetValue = styled(Box)`
  font-size: 17px;
  color: ${(props) => props.theme.palette.black.main};
  padding: 0;
  margin: 0;
`;
