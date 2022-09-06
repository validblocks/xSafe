import { Button, Typography, Box, Select, TextField } from '@mui/material';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

export const MainButton = styled(Button)`
  padding:
    ${(props) => props.theme.padding.value.sm}
    ${(props) => props.theme.padding.value.lg}
    ${(props) => props.theme.padding.value.xs} !important;
  color: ${(props) => props.theme.palette.primary.main} !important;
  font-weight: ${(props) => props.theme.font.weight.lg} !important;
  text-transform: capitalize !important;
  transition: all .15s linear !important;
  border: 1px solid
    ${(props) => props.theme.palette.primary.main} !important;
  background-color: ${(props) => props.theme.palette.background.main} !important;
  box-shadow: 0px 0px 8px
    ${(props) => props.theme.shadows.main} !important;
  &:disabled{
    background-color: #eee !important;
    border-color: #ddd !important;
    color: grey !important;
    box-shadow: none !important;
  }
  &:hover, &.isActive {
    background-color: ${(props) => props.theme.palette.primary.main} !important;
    color: ${(props) => props.theme.palette.background.white} !important;
    & svg path {
      fill: ${(props) => props.theme.palette.background.white} !important;
      fill-opacity: 1 !important;
    }
  }
`;

export const NewTransactionButton = styled(MainButton)`
  font-size: 15px !important;
  padding:
      ${(props) => props.theme.padding.value.md}
      25px
      ${(props) => props.theme.padding.value.sm} !important;
  font-weight: ${(props) => props.theme.font.weight.md} !important;
`;

export const AccountButton = styled(MainButton)`
  padding: 10px 18px 9px 10px !important;
`;

export const ChangeStepButton = styled(MainButton)`
  font-size: 15px !important;
  padding:
      ${(props) => props.theme.padding.value.xs}
      auto !important;
  font-weight: ${(props) => props.theme.font.weight.md} !important;
  width: 100% !important;
  box-shadow: none !important;
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
  }`;

export const AssetActionButton = styled(MainButton)`
  padding: 1px ${(props) => props.theme.padding.value.lg} 0 0 !important;
  opacity: 0;
  box-shadow: 0px 0px 8px
    ${(props) => props.theme.shadows.main} !important;
`;

export const WithdrawButton = styled(AccountButton)`
  height: 30px !important;
  width: 100% !important;
  padding: .17rem .5rem 0rem !important;
  margin-right: 0 !important;
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

export const FormSearchInput = styled(Box)`
  width: 23ch;
  margin-left: .93rem;
  padding: .12rem .5rem;
  display: flex;
  flex-direction: row;
  aling-items: center;
  border-radius: .3rem;
  background-color: rgba(76,47,252, 0.06);
  & input{
    padding: .25rem;
  };
  & fieldset{
    border: none;
  };
  & svg{
    margin-top: 2px;
  };
`;

export const InputsContainer = styled(Box)`
  margin: .67rem 0 1.93rem;
  position: relative;
  background-color: transparent;
  z-index: 0;
  &.invalid {
    margin-bottom: 0.7rem;
  }
  &:focus-within {
    input.form-control {
      border: solid 2px ${(props) => props.theme.palette.primary.main} !important;
    }
    li, div.MuiOutlinedInput-root {
      height: 58px;
      border: solid 2px ${(props) => props.theme.palette.primary.main} !important;
    }
    .MuiButton-root {
      top: 16px;
    }
  };
  &:hover {
    input.form-control {
      border-color: ${(props) => props.theme.palette.black.main};
    }
    li {
      border-color: ${(props) => props.theme.palette.black.main};
    }
    div.MuiOutlinedInput-root {
      border-color: ${(props) => props.theme.palette.black.main};
    }
  };
  & div.MuiOutlinedInput-root.Mui-focused {
    height: 56px;
    border: solid 1px rgba(76, 47, 252, 0.23) !important;
  }
  & label {
    position: absolute;
    padding: 0 3px;
    top: -10px;
    left: 10px;
    color: ${(props) => props.theme.palette.primary.main};
    font-size: 12px;
    background-color: #ffff;
  };
  & input.form-control.is-invalid ~ label {
    color: ${(props) => props.theme.palette.danger.main};
  }
  & input.form-control {
    width: 100%;
    height: auto;
    padding: 16.5px 14px;
    background-color: transparent;
    border: solid 1px rgba(76, 47, 252, 0.23);
    border-radius: .3rem;
    transition: border-color 0s;
  };
  & input.form-control.is-invalid {
    background: none;
    border: solid 1px ${(props) => props.theme.palette.danger.main};
  }
  & input.form-control.is-invalid:focus {
    background: none;
    border: solid 2px ${(props) => props.theme.palette.danger.main} !important;
  }
  & input.form-control.is-invalid ~ li,
    input.form-control.is-invalid ~ div.MuiOutlinedInput-root {
    border-color: ${(props) => props.theme.palette.danger.main} !important;
  }
  & input.form-control.is-invalid:focus ~ li,
    input.form-control.is-invalid:focus ~ div.MuiOutlinedInput-root {
    border: solid 2px ${(props) => props.theme.palette.danger.main} !important;
  }
  & input.form-control:focus {
    outline: none;
    border: solid 2px ${(props) => props.theme.palette.primary.main};
    box-shadow: none;
  };
  & h6.availableAmount {
    position: absolute;
    bottom: -20px;
    left: 4px;
    display: table;
    font-size: 12px;
    color: grey;
  };
  & li {
    position: absolute;
    width: 103.56px;
    height: 56px;
    top: 0;
    right: 0;
    border: solid 1px rgba(76, 47, 252, 0.23);
    border-radius: .3rem;
    border-top-left-radius: 2rem;
    border-bottom-left-radius: 2rem;
    z-index: -1;
    &:hover {
      background-color: transparent;
    }
    & svg {
      width: 26px !important;
      height: 26px !important;
      margin: 0;
    }
    & img {
      width: 35px !important;
      height: 35px !important;
      border-radius: 50%;
      margin: 0;
    }
    & > div.MuiBox-root > div.MuiBox-root:nth-of-type(1) {
      padding: .6rem;
      margin: 0;
      margin-right: .55rem;
      background-color: rgba(76, 47, 252, 0.1);
      border: solid 1px #ddd;
      border-radius: 50%;
    }
  };
  & div.invalid-feedback {
    margin-left: 4px;
  };
`;

export const DepositDoneAction = styled(Button)`
  background-color: ${(props) => props.theme.palette.primary.main};
  border: none;
  color: #ffff;
`;

export const ActionResponseButton = styled(MainButton)`
  &.dialogButton {
    width: 100% !important;
    height: 48px;
    box-shadow: none !important;
  };
`;

export const MaxSendEGLDButton = styled(MainButton)`
  position: absolute;
  min-width: 30px;
  top: 15px;
  right: 112px;
  line-height: 1.4;
  font-weight: ${(props) => props.theme.font.weight.sm};
  box-shadow: none !important;
  border-radius: .2rem !important;
`;

export const StakingSearchBar = styled(TextField)`
  & .MuiFilledInput-root {
    background-color: transparent;
  }
  width: 100%;
  & .MuiFilledInput-root:before { 
    border-bottom: 1px solid ${(props) => props.theme.palette.divider.main};
  }
  & .MuiFilledInput-root:after {
    border-color: ${(props) => props.theme.palette.primary.main};
  }
  & .MuiFilledInput-input {
    padding: 1rem 0;
  }
  &:hover {
    & .MuiFilledInput-root:before {
      border-color: ${(props) => props.theme.palette.secondary.main} !important;
    }
  }
`;

export const ProposeAddressInput = styled(TextField)`
  width: 100%;
  &.isAddressError {
    & fieldset {
      border-color: ${(props) => props.theme.palette.danger.main} !important;
    };
  }
`;

export const ModalContainer = styled(Modal)`
&.isSendTokenModal ~ .MuiPopover-root > .MuiPaper-root {
  left: calc(50% - 1px) !important;
};
&.isUnstakeTokenModal ~ .MuiPopover-root > .MuiPaper-root {
  left: calc(50% - 228px) !important;
  top: calc(50% + 5px) !important;
};
`;
