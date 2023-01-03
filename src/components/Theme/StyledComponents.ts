import { Button, Typography, Box, Select, TextField, Pagination } from '@mui/material';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

export const MainButton = styled(Button)`
&&& {
  padding: ${(props) => props.theme.padding.value.sm} ${(props) => props.theme.padding.value.lg} ${(props) => props.theme.padding.value.xs};
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.font.weight.lg};
  text-transform: capitalize;
  transition: all .15s linear;
  border: 1px solid #4c2FFC;
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  & svg path {
    fill: ${(props) => props.theme.palette.background.svg};
    fill-opacity: 1;
  };
  &:disabled {
    background-color: ${(props) => props.theme.palette.background.disabled};
    border-color: ${(props) => props.theme.palette.background.disabled};
    color: ${(props) => props.theme.palette.text.disabled};
    box-shadow: none;
  };

  &:hover, &.isActive {
    background-color: ${(props) => props.theme.palette.background.button} !important;
    border-color: ${(props) => props.theme.palette.background.button} !important;
    color: ${(props) => props.theme.palette.background.white};
    & svg path {
      fill: ${(props) => props.theme.palette.background.white};
      fill-opacity: 1;
    };
  };
}
`;

export const MainButtonNoShadow = styled(MainButton)`
&&& {
  box-shadow: none;
  text-transform: none;
}
`;

export const NewTransactionButton = styled(MainButton)`
&&& {
  height: 40px;
  min-width: 156px;
  font-size: 15px;
  font-weight: ${(props) => props.theme.font.weight.md};
  @media (max-width:600px) {
    min-width: 175px;
    width: '100%'
  }
}
`;

export const ChangeQuorumButton = styled(NewTransactionButton)`
&&& {
  padding: ${(props) => props.theme.padding.value.md}
  25px
  ${(props) => props.theme.padding.value.sm};
  @media (max-width: 600px) {
    width: 100%;
  };
}
`;

export const AccountButton = styled(MainButton)`
&&& {
  padding: 10px 18px 9px 10px;
  @media (max-width: 600px){
    /* width: 24px; */
    min-width: 125px;
    /* height: 24px; */
    padding: 8px 18px 7px 10px;
    background-color: #4c2FFC;
    & svg path {
    fill: #fff;
    fill-opacity: 1;
  };
  }
}
`;

export const ChangeStepButton = styled(MainButton)`
&&& {
  width: 100%;
  padding: ${(props) => props.theme.padding.value.xs} auto;
  font-size: 15px;
  font-weight: ${(props) => props.theme.font.weight.md};
  box-shadow: none;
  &:disabled {
    background-color: ${(props) => props.theme.palette.background.disabled} !important;
    border-color: ${(props) => props.theme.palette.background.disabled} !important;
    box-shadow: none;
    & p {
      color: ${(props) => props.theme.palette.text.disabled} !important;
    }
  };
}
`;

export const FinalStepActionButton = styled(ChangeStepButton)`
&&& {
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid #4c2FFC;
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  &:hover, &.isActive {
    background-color: ${(props) => props.theme.palette.background.button};
    border-color: ${(props) => props.theme.palette.background.button};
    color: ${(props) => props.theme.palette.background.white};
    & svg path {
      fill: ${(props) => props.theme.palette.background.white};
      fill-opacity: 1;
    };
  };
}
`;

export const AssetActionButton = styled(MainButton)`
&&& {
  padding: 1px ${(props) => props.theme.padding.value.lg} 0 0;
  opacity: 0;
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  background-color: ${(props) => props.theme.palette.background.main};
  color: ${(props) => props.theme.palette.text.button};
  '& svg': {
    color: ${(props) => props.theme.palette.text.svg}
  }
}

@media (max-width: 600px){
  &&& {
    opacity: 1;
  }
}
`;

export const WithdrawButton = styled(AccountButton)`
&&& {
  height: 30px;
  width: 100%;
  padding: .17rem .5rem 0rem;
  margin-right: 0;
}
`;

export const MainSelect = styled(Select)<any>`
&&& {
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid #4c2FFC;
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  & svg path {
    fill: ${(props) => props.theme.palette.background.svg};
    fill-opacity: 1;
  };
  &:before {
    display: none;
  }
  &:hover {
    border-color: ${(props) => props.theme.palette.background.button};
    background-color: ${(props) => props.theme.palette.background.button};
    color: ${(props) => props.theme.palette.background.white};
  }
  &:after {
    border-bottom: none;
  }
}
`;

export const TypographyBold = styled(Typography)`
&&& {
  font-weight: ${(props) => props.theme.typography.bold};
}
`;

export const Main = styled.main`
  width: 100%;
  background-color: ${(props) => props.theme.palette.background.default};
  overflow-y: auto;
  padding: 20px;
  @media (max-width:600px) {
    padding: 16px;
  }
`;

export const AssetValue = styled(Box)`
&&& {
  padding: 0;
  margin: 0px;
  font-size: 13px;
  color: ${(props) => props.theme.palette.text.primary};
}
`;

export const FormSearchInput = styled(Box)`
&&& { 
  width: 23ch;
  margin-left: .93rem;
  padding: .12rem .5rem;
  display: flex;
  flex-direction: row;
  aling-items: center;
  border-radius: .3rem;
  background-color: rgba(76,47,252, 0.06);
  & svg {
    margin-top: 2px;
  }
  & svg > path{
    fill: ${(props) => props.theme.palette.svg.search};
    fill-opacity: ${(props) => props.theme.palette.svg.fillOpacity};
  };
  & .MuiOutlinedInput-root {
    text-transform: none;
    color: ${(props) => props.theme.palette.text.primary} !important;
  }
  & input {
    padding: .25rem;
  };
  & fieldset {
    border: none;
  };
}
`;

export const InputsContainer = styled(Box)`
&&& {
  margin: 10px 0 20px;
  position: relative;
  background-color: transparent;
  transition: all .3s linear;
  z-index: 0;
  &.invalid {
    margin-bottom: 26px;
  };
  &.invalid.hasAvailableAmount {
    margin-bottom: 34px;
  };
  & input.form-control, & label, & li, & div.MuiOutlinedInput-root {
    transition: all .3s linear;
    color: ${(props) => props.theme.palette.text.primary};
  };
  div.MuiOutlinedInput-root {
    border: solid 1px ${(props) => props.theme.palette.borders.secondary};
  };
  &:focus-within {
    input.form-control {
      border-color: ${(props) => props.theme.palette.borders.active};
    };
    li, div.MuiOutlinedInput-root {
      border: solid 1px ${(props) => props.theme.palette.borders.active};
    };
  };
  &:hover {
    input.form-control {
      border-color: ${(props) => props.theme.palette.borders.active};
    };
    li {
      border-color: ${(props) => props.theme.palette.borders.active};
    };
    div.MuiOutlinedInput-root {
      border-color: ${(props) => props.theme.palette.borders.active};
    };
  };
  & div.MuiOutlinedInput-root.Mui-focused {
    height: 56px;
    border-color: ${(props) => props.theme.palette.borders.active};
  };
  & label {
    position: absolute;
    padding: 0 3px;
    top: -10px;
    left: 10px;
    color: ${(props) => props.theme.palette.text.secondary};
    font-size: 12px;
    background-color: ${(props) => props.theme.palette.background.secondary};
  };
  & input.form-control.is-invalid ~ label {
    color: ${(props) => props.theme.palette.danger.main};
  };
  & input.form-control {
    width: 100%;
    height: auto;
    padding: 16.5px 14px;
    background-color: transparent;
    border: solid 1px ${(props) => props.theme.palette.borders.secondary};
    border-radius: .3rem;
  };
  & input.form-control.is-invalid {
    background: none;
    border: solid 1px ${(props) => props.theme.palette.danger.main};
  };
  & input.form-control.is-invalid:focus {
    background: none;
    border: solid 1px ${(props) => props.theme.palette.danger.main};
  };
  & input.form-control.is-invalid ~ li, input.form-control.is-invalid ~ div.MuiOutlinedInput-root {
    border-color: ${(props) => props.theme.palette.danger.main};
  };
  & input.form-control.is-invalid:focus ~ li, input.form-control.is-invalid:focus ~ div.MuiOutlinedInput-root {
    border: solid 1px ${(props) => props.theme.palette.danger.main};
  };
  & input.form-control:focus {
    outline: none;
    border: solid 1px ${(props) => props.theme.palette.borders.active};
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
    border: solid 1px ${(props) => props.theme.palette.borders.secondary};
    color: ${(props) => props.theme.palette.text.primary};
    border-radius: .3rem;
    border-top-left-radius: 2rem;
    border-bottom-left-radius: 2rem;
    z-Index: -1;
    &:hover {
      background-color: transparent;
    };
    & svg {
      width: 26px;
      height: 26px;
      margin: 0;
    };
    & img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin: 0;
    };
    & > div.MuiBox-root > div.MuiBox-root:nth-of-type(1) {
      padding: .6rem;
      margin: 0;
      margin-right: .55rem;
      background-color: rgba(76, 47, 252, 0.1);
      border: solid 1px #ddd;
      border-radius: 50%;
    };
  };
  & > span.errorMessage {
    position: absolute;
    display: table;
    content: "";
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
    text-transform: uppercase;
  };
  &.invalid > span.errorMessage {
    transform: translateY(0px);
    opacity: 1;
  };
  &.invalid h6.availableAmount {
    transition: bottom .3s linear;
    bottom: -36px;
  };
}
`;

export const DepositDoneAction = styled(Button)`
&&& {
  background-color: ${(props) => props.theme.palette.primary.main};
  border: none;
  color: #ffff;
}
`;

export const ActionResponseButton = styled(MainButton)`
&&& {
  width: 100%;
  height: 48px;
  box-shadow: none;
}
`;

export const MaxSendEGLDButton = styled(MainButton)`
&&& {
  position: absolute;
  min-width: 30px;
  top: 15px;
  right: 112px;
  line-height: 1.4;
  font-weight: ${(props) => props.theme.font.weight.sm};
  box-shadow: none;
  border-radius: .2rem;
}
`;

export const StakingSearchBar = styled(TextField)`
&&& {
  width: 100%;
  & .MuiFilledInput-root {
    background-color: transparent;
    color: ${(props) => props.theme.palette.text.primary} !important;
  };
  & .MuiFilledInput-root:before {
    border-bottom: 1px solid ${(props) => props.theme.palette.divider.secondary};
  };
  & .MuiFilledInput-root:after {
    border-color: ${(props) => props.theme.palette.borders.active};
  };
  & .MuiFilledInput-input {
    padding: 1rem 0;
  };
  & .MuiSvgIcon-root {
    color: ${(props) => props.theme.palette.text.primary};
  }
  &:hover {
    & .MuiFilledInput-root:before {
      border-color: ${(props) => props.theme.palette.borders.active};
    };
  };
}
`;

export const ProposeAddressInput = styled(TextField)`
&&& {
  width: 100%;
  &.isAddressError {
    & fieldset {
      border-color: ${(props) => props.theme.palette.danger.main} !important;
    };
  };
}
`;

export const ModalContainer = styled(Modal)`
&&& {
  & ~ .MuiPopover-root.UnstakeTokenListOpened > .MuiPaper-root {
    min-width: 428px !important;
    width: 460px;
    top: calc(50% + 8px) !important;
    left: calc(50% - 230px) !important;
    background-color: ${(props) => props.theme.palette.background.secondary};
    & .MuiTypography-root {
      color: ${(props) => props.theme.palette.text.primary} !important;
    }
  };
  & ~ .MuiPopover-root.SendTokenListOpened > .MuiPaper-root {
    top: calc(50% + 28px) !important;
    left: calc(50% - 5px)!important;
    background-color: ${(props) => props.theme.palette.background.secondary};
  };
  & ~ .MuiPopover-root.SendTokenListOpenedWithoutEGLD > .MuiPaper-root {
    top: calc(50% + 72px) !important;
    left: calc(50% - 5px) !important;
    background-color: ${(props) => props.theme.palette.background.secondary};
  };
  @media (max-width: 991px) {
    & ~ .MuiPopover-root.UnstakeTokenListOpened > .MuiPaper-root {
      width: 428px !important;
      top: calc(50% + 8px) !important;
      left: calc(50% - 213px) !important;
    };
    & ~ .MuiPopover-root.SendTokenListOpened > .MuiPaper-root {
      top: calc(50% + 28px) !important;
      left: calc(50% - 20px) !important;
    };
    & ~ .MuiPopover-root.SendTokenListOpenedWithoutEGLD > .MuiPaper-root {
      top: calc(50% + 72px) !important;
      left: calc(50% - 20px) !important;
    };
  }
  @media (max-width: 600px){
    & ~ .MuiPopover-root.SendTokenListOpened > .MuiPaper-root {
      top: calc(50% + 16px) !important;
      left: calc(50% + 3px) !important;
    };
    & ~ .MuiPopover-root.SendTokenListOpenedWithoutEGLD > .MuiPaper-root {
      top: calc(50% + 60px) !important;
      left: calc(50% + 3px) !important;
    }; 
  }
  @media (max-width: 575px){
    & ~ .MuiPopover-root.SendTokenListOpened > .MuiPaper-root {
      min-width: 230px !important;
      right: 24px !important;
      left: auto !important;
    };
    & ~ .MuiPopover-root.SendTokenListOpenedWithoutEGLD > .MuiPaper-root {
      min-width: 230px !important;
      right: 24px !important;
      left: auto !important;
    }; 
  }
  & .modal-content {
    background-color: ${(props) => props.theme.palette.background.secondary};
  }
  & ~ .modal-container.wallect-connect-login {
    & .modal-content {
      background-color: ${(props) => props.theme.palette.background.secondary};
    }
  }
  @media (max-width: 600px) {
    & .modal-content .card-body {
    padding: 16px !important;
  }
  }
}
`;

export const ModalCreateSafe = styled(Modal)(({ theme: _ }) => ({
  '&&&': {
    '& .modal-content': {
      backgroundColor: _.palette.background.secondary,
    },
  },
}));

export const ModalConnectContainer = styled(Modal)(({ theme: _ }) => ({
  '&&&': {
    '& .modal-content': {
      backgroundColor: _.palette.background.secondary,
    },
    '& ~ .modal-container.wallect-connect-login, & ~ .modal-container.ledger-login': {
      '& .modal-content': {
        backgroundColor: _.palette.background.secondary,
        '& .card-title': {
          color: _.palette.text.primary,
          '& div.pt-spacer': {
            paddingTop: '24px !important',
            paddingRight: '43px !important',
            paddingLeft: '48px !important',
            paddingBottom: '22px !important',
            borderBottom: `solid 1px ${_.palette.divider.secondary}`,
            '& div.px-3': {
              paddingRight: '0 !important',
              paddingLeft: '0 !important',
            },
          },
          '& button': {
            backgroundColor: 'transparent !important',
            border: 'none !important',
            color: `${_.palette.text.primary} !important`,
            fontSize: '1rem !important',
            padding: '6px 10px 5px 10px !important',
            borderRadius: '50% !important',
            '&:hover': {
              backgroundColor: `${_.palette.hover.secondary} !important`,
            },
          },
        },
        '& .modal-card-body': {
          padding: '24px 48px !important',
          '& div.wallect-connect-login_container, & div.login-container': {
            '& div.wallect-connect-login_card, & div.card': {
              backgroundColor: _.palette.background.secondary,
              color: _.palette.text.primary,
              marginBottom: '5px !important',
              '& a, & button': {
                width: '100%',
                backgroundColor: _.palette.background.main,
                color: _.palette.primary.main,
                marginTop: '15px !important',
                '& svg': {
                  display: 'none',
                },
              },
            },
          },
        },
      },
    },
    '@media (max-width: 600px)': {
      '& ~ .modal-container.wallect-connect-login, & ~ .modal-container.ledger-login': {
        '& .modal-content': {
          '& .card-title': {
            '& div.pt-spacer': {
              paddingTop: '16px !important',
              paddingRight: '13px !important',
              paddingLeft: '16px !important',
              paddingBottom: '14px !important',
            },
          },
          '& .modal-card-body': {
            padding: '16px !important',
          },
        },
      },
    },
  },
}));

export const PerformModal = styled(Box)`
&&& {
  background-color: ${(props) => props.theme.palette.background.secondary};
  padding: 21px 40px;
}
`;

export const RemoveItemsButton = styled(MainButton)`
&&& {
  min-width: 56px;
  height: 56px;
  padding: 0;
  box-shadow: none;
}
`;

export const FormikRoundedCheckBox = styled(Box)`
&&& {
  margin: 7px 0;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.palette.text.primary};
  & input[type="checkbox"] {
    appearance: none;
    position: relative;
    width: 25px;
    height: 25px;
    border: solid 1px ${(props) => props.theme.palette.borders.secondary};
    border-radius: .2rem;
    transition: 300ms all ease-in-out;
  };
  & input[type="checkbox"]:hover {
    border-color: ${(props) => props.theme.palette.borders.active};
  };
  & input[type="checkbox"]:focus {
    outline: none;
  };
  & input[type="checkbox"]:checked {
    background-color: #4c2FFC;
    border-color: #4c2FFC;
  };
  input[type="checkbox"]:before {
    position: absolute;
    content: "";
    width: 12px;
    height: 12px;
    top: 6px;
    left: 5px;
    transform: scale(0);
    transition: 300ms all ease-in-out;
    box-shadow: inset 1em 1em ${(props) => props.theme.palette.background.white};
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  };
  input[type="checkbox"]:checked:before {
    transform: scale(1);
  };
  & label {
    margin-left: 5px;
    font-size: 15px;
  };
}
`;

export const InputWrapper = styled.div`
&&& {
  position: relative;
  margin-bottom: 14px;
  transition: margin-bottom .3s linear;
  &.invalid {
    margin-bottom: 26px;
  };
  & > div.MuiFormControl-root ~ span.errorMessage {
    position: absolute;
    content: '';
    display: table;
    left: 5px;
    bottom: -9px;
    color: ${(props) => props.theme.palette.danger.main};
    line-height: 0;
    font-size: 10.5px;
    transform: translateY(-7px);
    transition: transform .3s linear, opacity .3s linear;
    opacity: 0;
  };
  & > div.MuiFormControl-root ~ span:first-letter {
    text-transform: uppercase;
  };
  & > div.MuiFormControl-root.isError ~ span.errorMessage {
    font-size: 10.5px;
    transform: translateY(0);
    opacity: 1;
  };
  @media (max-width:600px) {
    margin-bottom: 16px;
  };
}
`;

export const StyledPagination = styled(Pagination)`
  & li {
    & button {
      color: ${(props) => props.theme.palette.text.primary};
    }
    & .Mui-selected {
      background-color: ${(props) => props.theme.palette.background.pagination}
    }
  }
`;

export const PaginationSelect = styled(Select)<any>`
&&& {
  color: ${(props) => props.theme.palette.text.primary};
  & svg path {
    fill: ${(props) => props.theme.palette.text.primary};
    fill-opacity: 1;
  };
  & fieldset {
    border-color: ${(props) => props.theme.palette.borders.secondary};
  };
  &:hover fieldset{
    border-color: ${(props) => props.theme.palette.hover.select};
  };
}
`;

export const TokenSelect = styled(Select)<any>`
&&& {
  color: ${(props) => props.theme.palette.text.primary};
  & svg path {
    fill: ${(props) => props.theme.palette.text.primary};
    fill-opacity: 1;
  };
  & fieldset {
    border-color: ${(props) => props.theme.palette.borders.secondary};
  };
  &:hover fieldset{
    border-color: ${(props) => props.theme.palette.borders.active};
  };
}
`;
