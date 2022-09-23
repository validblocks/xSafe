import { Button, Typography, Box, Select, TextField } from '@mui/material';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

export const MainButton = styled(Button)(({ theme }) => ({
  padding: `${theme.padding.value.sm} 
            ${theme.padding.value.lg}
            ${theme.padding.value.xs}`,
  color: theme.palette.primary.main,
  fontWeight: theme.font.weight.lg,
  textTransform: 'capitalize',
  transition: 'all .15s linear',
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.main,
  boxShadow: `0px 0px 8px ${theme.shadows.main}`,
  '&:disabled': {
    backgroundColor: '#eee',
    borderColor: '#ddd',
    color: 'grey',
    boxShadow: 'none',
  },
  '&:hover, &.isActive': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.white,
    '& svg path': {
      fill: theme.palette.background.white,
      fillOpacity: '1',
    },
  },
}));

export const NewTransactionButton = styled(MainButton)(({ theme }) => ({
  padding: `${theme.padding.value.md}
            25px
            ${theme.padding.value.sm}`,
  fontSize: '15px',
  fontWeight: theme.font.weight.md,
}));

export const AccountButton = styled(MainButton)(() => ({
  padding: '10px 18px 9px 10px',
}));

export const ChangeStepButton = styled(MainButton)(({ theme }) => ({
  width: '100%',
  padding: `${theme.padding.value.xs} auto`,
  fontSize: '15px !important',
  fontWeight: theme.font.weight.md,
  boxShadow: 'none',
}));

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
  margin: 10px 0 20px;
  position: relative;
  background-color: transparent;
  transition: all .3s linear;
  z-index: 0;
  &.invalid {
    margin-bottom: 26px;
  }
  &.invalid.hasAvailableAmount {
    margin-bottom: 34px;
  }
  & input.form-control,
  & label,
  & li,
  & div.MuiOutlinedInput-root {
    transition: all .3s linear;
  }
  &:focus-within {
    input.form-control {
      border: solid 1px ${(props) => props.theme.palette.primary.main} !important;
    }
    li, div.MuiOutlinedInput-root {
      border: solid 1px ${(props) => props.theme.palette.primary.main} !important;
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
  };
  & input.form-control.is-invalid {
    background: none;
    border: solid 1px ${(props) => props.theme.palette.danger.main};
  }
  & input.form-control.is-invalid:focus {
    background: none;
    border: solid 1px ${(props) => props.theme.palette.danger.main} !important;
  }
  & input.form-control.is-invalid ~ li,
    input.form-control.is-invalid ~ div.MuiOutlinedInput-root {
    border-color: ${(props) => props.theme.palette.danger.main} !important;
  }
  & input.form-control.is-invalid:focus ~ li,
    input.form-control.is-invalid:focus ~ div.MuiOutlinedInput-root {
    border: solid 1px ${(props) => props.theme.palette.danger.main} !important;
  }
  & input.form-control:focus {
    outline: none;
    border: solid 1px ${(props) => props.theme.palette.primary.main};
    box-shadow: none;
  };
  & h6.availableAmount {
    position: absolute;
    bottom: -20px;
    left: 4px;
    display: table;
    font-size: 12px;
    color: grey;
    transition: bottom .23s linear;
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
  & > span.errorMessage {
    position: absolute;
    display: table;
    content: '';
    left: 4px;
    bottom: -10px;
    line-height: 0;
    color: ${(props) => props.theme.palette.danger.main};
    transition: transform .3s linear, opacity .3s linear;
    font-size: 10.5px;
    transform: translateY(-7px);
    opacity: 0;
  };
  & > span.errorMessage:first-letter {
    text-transform: uppercase !important;
  }
  &.invalid > span.errorMessage {
    transform: translateY(0px);
    opacity: 1;
  };
  &.invalid h6.availableAmount {
    transition: bottom .3s linear;
    bottom: -36px;
  };
`;

export const DepositDoneAction = styled(Button)`
  background-color: ${(props) => props.theme.palette.primary.main};
  border: none;
  color: #ffff;
`;

export const ActionResponseButton = styled(MainButton)`
  width: 100% !important;
  height: 48px;
  box-shadow: none !important;
`;

export const MaxSendEGLDButton = styled(MainButton)(({ theme }) => ({
  position: 'absolute',
  minWidth: '30px',
  top: '15px',
  right: '112px',
  lineHeight: '1.4',
  fontWeight: theme.font.weight.sm,
  boxShadow: 'none',
  borderRadius: '.2rem',
}));

// const MaxSendEGLDButtonProps = (theme) => ({
//   minWidth: '30px',
//   // top: '15px',
//   // right: '112px',
//   lineHeight: '1.4',
//   fontWeight: theme.font.weight.sm,
//   boxShadow: 'none',
//   borderRadius: '.2rem',
// });
// export const MaxSendEGLDButton2 = styled()(({ theme }) => ({
//   ...MainButton,
//   ...MaxSendEGLDButtonProps(theme),
// }));

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

export const RemoveItemsButton = styled(MainButton)`
min-width: 56px !important;
height: 56px !important;
padding: 0 !important;
box-shadow: none !important;
`;

export const FormikRoundedCheckBox = styled(Box)`
  margin: 7px 0;
  display: flex !important;
  align-items: center !important;
  & input[type="checkbox"] {
    appearance: none !important;
    position: relative !important;
    width: 25px !important;
    height: 25px !important;
    border: solid 1px ${(props) => props.theme.palette.divider.main} !important;
    border-radius: .2rem !important;
    transition: 300ms all ease-in-out !important;
  }
  & input[type="checkbox"]:hover {
    border-color:  ${(props) => props.theme.palette.primary.main} !important;
  }
  & input[type="checkbox"]:focus {
    outline: none !important;
  }
  & input[type="checkbox"]:checked {
    background-color: ${(props) => props.theme.palette.primary.main} !important;
    border-color: ${(props) => props.theme.palette.primary.main} !important;
  }
  input[type="checkbox"]:before {
  position: absolute !important;  
  content: "" !important;
  width: 12px !important;
  height: 12px !important;
  top: 6px !important;
  left: 5px !important;
  transform: scale(0) !important;
  transition: 300ms all ease-in-out !important;
  box-shadow: inset 1em 1em ${(props) => props.theme.palette.background.white} !important;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%) !important;
  }
  input[type="checkbox"]:checked:before {
  transform: scale(1) !important;
  }
  & label {
    margin-left: 5px !important;
    font-size: 15px !important;
  }
`;

export const InputWrapper = styled.div`
position: relative !important;
margin-bottom: 14px !important;
transition: margin-bottom .3s linear !important;
&.invalid {
  margin-bottom: 26px !important;
}
& > div.MuiFormControl-root ~ span.errorMessage {
  position: absolute !important;
  content: '' !important;
  display: table !important;
  left: 5px;
  bottom: -9px;
  color: ${(props) => props.theme.palette.danger.main} !important;
  line-height: 0 !important;
  font-size: 10.5px !important;
  transform: translateY(-7px) !important;
  transition: transform .3s linear, opacity .3s linear !important;
  opacity: 0 !important;
}
& > div.MuiFormControl-root ~ span:first-letter {
  text-transform: uppercase !important;
}
& > div.MuiFormControl-root.isError ~ span.errorMessage {
  font-size: 10.5px !important;
  transform: translateY(0) !important;
  opacity: 1 !important;
}
`;
