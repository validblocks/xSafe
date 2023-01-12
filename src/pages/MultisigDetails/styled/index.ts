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
  margin-bottom: 12px;
`;

export const StyledSelect = styled(Select)<any>`
  border-radius: 0.33rem;
  border: solid 1px ${(props) => props.theme.palette.borders.secondary};
  &:hover {
    transition: all 0.3s linear;
    border-color: ${(props) => props.theme.palette.borders.active};
  }
  &.Mui-focused {
    border-color: ${(props) => props.theme.palette.borders.active};
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
  & .MuiSelect-nativeInput {
    opacity: 1;
    padding-left: 12px;
    border: none;
    left: auto;
    bottom: auto;
    background-color: transparent;
    color: ${(props) => props.theme.palette.text.primary};
  }
`;

export const StakedAssetsSelect = styled(Select)<any>`
  border-radius: 0.33rem;
  border: solid 1px ${(props) => props.theme.palette.borders.secondary};
  &:hover {
    transition: all 0.3s linear;
    border-color: ${(props) => props.theme.palette.borders.active};
  }
  & [role='button'] {
    padding-top: 0;
    padding-bottom: 0;
  }
  &
    .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input
    div
    p.delegated-amount {
    display: block !important;
  }
  @media (max-width: 600px) {
    &
      .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input
      div
      p.delegated-amount {
      display: none !important;
    }
  }
  & .MuiOutlinedInput-input {
    padding-left: 10px;
  }
  &.Mui-focused {
    border-color: ${(props) => props.theme.palette.borders.active};
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

export const UnstakeModalContainerBox = styled(Box)`
  span {
    color: grey;
    margin-left: 0.35rem;
    font-size: 13px;
  }
  label {
    margin-left: 0.3rem !important;
  }
`;
