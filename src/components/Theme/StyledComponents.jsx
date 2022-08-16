import { Button, Typography, Box, Select } from '@mui/material';
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

export const NewTransactionButton = styled(MainButton)`
  font-size: 15px;
  padding:
      ${(props) => props.theme.padding.value.md}
      25px
      ${(props) => props.theme.padding.value.sm};
  font-weight: ${(props) => props.theme.font.weight.md};
`;

export const ChangeStepButton = styled(MainButton)`
  font-size: 15px;
  padding:
      ${(props) => props.theme.padding.value.xs}
      auto;
  font-weight: ${(props) => props.theme.font.weight.md};
  width: 100%;
  box-shadow: none;
`;

export const FinalStepActionButton = styled(ChangeStepButton)`
  color: ${(props) => props.theme.palette.background.default};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.primary.main};
  &:hover  {
    box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
    color: ${(props) => props.theme.palette.background.default};
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    background-color: ${(props) => props.theme.palette.primary.main};
  }
`;

export const AssetActionButton = styled(MainButton)`
  padding: 1px ${(props) => props.theme.padding.value.lg} 0 0;
  opacity: 0;
  transition: all .3s;
`;

export const MainSelect = styled(Select)`
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
`;

export const TypographyBold = styled(Typography)`
  font-weight: ${(props) => props.theme.typography.bold};
`;

export const Main = styled.main`
  background-color: ${(props) => props.theme.palette.background.default};
`;

export const AssetValue = styled(Box)`
  font-size: 13px;
  color: ${(props) => props.theme.palette.black.main};
  padding: 0;
  margin: 0px;
`;

export const AccountButton = styled.div`
  &:hover ${Button} {
    background-color: red;
  }
`;
