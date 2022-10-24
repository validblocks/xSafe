import { Box, Select } from '@mui/material';
import { MainButtonNoShadow } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';

export const CardButton = styled(MainButtonNoShadow)`
  &&& {
    width: 100%;
    font-size: 14px;
    font-weight: 400 !important;
    padding-left: 4px !important;
    margin-top: 1rem;
  }
`;

export const DetailsCardContainerBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 12px 0;
`;

export const StyledSelect = styled(Select)`
  border-radius: 0.33rem;
  border: solid 1px ${(props) => props.theme.palette.borders.secondary};
  &:hover {
    transition: all 0.3s linear;
    border-color: ${(props) => props.theme.palette.borders.active};
  }
  & .MuiInputBase-input {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  & fieldset {
    display: none;
  }
  & .MuiTypography-root {
    color: ${(props) => props.theme.palette.text.primary} !important;
  }
  & .MuiSvgIcon-root {
    color: ${(props) => props.theme.palette.text.primary} !important;
  }
`;
