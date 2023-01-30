/* eslint-disable indent */
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
  && {
    border-radius: 0.33rem;
    border: solid 1px ${(props) => props.theme.palette.borders.secondary};
    &:hover {
      transition: all 0.3s linear;
      border: solid 1px ${(props) => props.theme.palette.borders.active};
      & fieldset {
        border-color: transparent;
      }
    }
    & fieldset {
      top: -5px;
      left: 0;
      bottom: 0;
      right: 0;
      border-color: transparent;
      overflow: visible;
      & legend {
        max-width: 100%;
        overflow: visible;
        visibility: visible;
        position: absolute;
        left: 6px;
        top: -8px;
        & span {
          opacity: 1;
          color: ${(props) => props.theme.palette.text.primary};
          background-color: ${(props) =>
            props.theme.palette.background.secondary};
          font-size: 12px;
          font-weight: 400;
          font-family: 'IBM Plex Sans', SFMono-Regular, Menlo, Monaco, Consolas,
            'Liberation Mono', 'Courier New', monospace;
        }
      }
    }
    &.Mui-focused {
      border: solid 1px ${(props) => props.theme.palette.borders.active};
    }
    &.Mui-focused fieldset legend {
      top: -9px;
      left: 5px;
    }
    &.Mui-focused fieldset {
      border-color: transparent;
    }
    & .MuiTypography-root {
      color: ${(props) => props.theme.palette.text.primary} !important;
    }
    & .MuiSvgIcon-root {
      color: ${(props) =>
        props.theme.palette.background.transactionsExpand} !important;
    }
    &.Mui-focused {
      & .MuiSvgIcon-root {
        color: #4c2ffc !important;
      }
    }
    & .MuiSelect-nativeInput {
      opacity: 0;
      padding-left: 12px;
      border: none;
      left: auto;
      bottom: auto;
      background-color: transparent;
      color: ${(props) => props.theme.palette.text.primary};
    }
    @media (max-width: 600px) {
      width: 100%;
    }
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
