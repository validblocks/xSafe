import { Button, Typography, Box, Select, TextField } from '@mui/material';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

export const MainButton = styled(Button)`
&&& {
  padding: ${(props) => props.theme.padding.value.sm} 
            ${(props) => props.theme.padding.value.lg}
            ${(props) => props.theme.padding.value.xs};
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.font.weight.lg};
  text-transform: capitalize;
  transition: all .15s linear;
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  &:disabled {
    background-color: #eee;
    border-color: #ddd;
    color: grey;
    box-shadow: none;
  };
  &:hover, &.isActive {
    background-color: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.background.white};
    & svg path {
      fill: ${(props) => props.theme.palette.background.white};
      fill-opacity: 1;
    };
  };
}
`;

export const NewTransactionButton = styled(MainButton)`
&&& {
  padding: ${(props) => props.theme.padding.value.md}
            25px
            ${(props) => props.theme.padding.value.sm};
  font-size: 15px;
  font-weight: ${(props) => props.theme.font.weight.md};
}
`;

export const AccountButton = styled(MainButton)`
&&& {
  padding: 10px 18px 9px 10px;
}
`;

export const ChangeStepButton = styled(MainButton)`
&&& {
  width: 100%;
  padding: ${(props) => props.theme.padding.value.xs} auto;
  font-size: 15px;
  font-weight: ${(props) => props.theme.font.weight.md};
  box-shadow: none;
}
`;

export const FinalStepActionButton = styled(ChangeStepButton)`
&&& {
  color: ${(props) => props.theme.palette.background.default};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.primary.main};
  &:hover {
    box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
    color: ${(props) => props.theme.palette.background.default};
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    background-color: ${(props) => props.theme.palette.primary.main};
  };
}
`;

export const AssetActionButton = styled(MainButton)`
&&& {
  padding: 1px ${(props) => props.theme.padding.value.lg} 0 0;
  opacity: 0;
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
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

export const MainSelect = styled(Select)`
&&& {
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
}
`;

export const TypographyBold = styled(Typography)`
&&& {
  font-weight: ${(props) => props.theme.typography.bold};
}
`;

export const Main = styled.main`
  background-color: ${(props) => props.theme.palette.background.default};
`;

export const AssetValue = styled(Box)`
&&& {
  font-size: 13px;
  color: ${(props) => props.theme.palette.black.main};
  padding: 0;
  margin: 0px;
}
`;

export const FormSearchInput = styled(Box)(() => ({
  width: '23ch',
  marginLeft: '.93rem',
  padding: '.12rem .5rem',
  display: 'flex',
  flexDirection: 'row',
  alingItems: 'center',
  borderRadius: '.3rem',
  backgroundColor: 'rgba(76,47,252, 0.06)',
  '& input': {
    padding: '.25rem',
  },
  '& fieldset': {
    border: 'none',
  },
  '& svg': {
    marginTop: '2px',
  },
}));

export const InputsContainer = styled(Box)(({ theme }) => ({
  margin: '10px 0 20px',
  position: 'relative',
  backgroundColor: 'transparent',
  transition: 'all .3s linear',
  zIndex: 0,
  '&.invalid': {
    marginBottom: '26px',
  },
  '&.invalid.hasAvailableAmount': {
    marginBottom: '34px',
  },
  '& input.form-control, & label, & li, & div.MuiOutlinedInput-root': {
    transition: 'all .3s linear',
  },
  '&:focus-within': {
    'input.form-control': {
      border: `solid 1px ${theme.palette.primary.main}`,
    },
    'li, div.MuiOutlinedInput-root': {
      border: `solid 1px ${theme.palette.primary.main}`,
    },
  },
  '&:hover': {
    'input.form-control': {
      borderColor: theme.palette.black.main,
    },
    li: {
      borderColor: theme.palette.black.main,
    },
    'div.MuiOutlinedInput-root': {
      borderColor: theme.palette.black.main,
    },
  },
  '& div.MuiOutlinedInput-root.Mui-focused': {
    height: '56px',
    border: 'solid 1px rgba(76, 47, 252, 0.23)',
  },
  '& label': {
    position: 'absolute',
    padding: '0 3px',
    top: '-10px',
    left: '10px',
    color: theme.palette.primary.main,
    fontSize: '12px',
    backgroundColor: '#ffff',
  },
  '& input.form-control.is-invalid ~ label': {
    color: theme.palette.danger.main,
  },
  '& input.form-control': {
    width: '100%',
    height: 'auto',
    padding: '16.5px 14px',
    backgroundColor: 'transparent',
    border: 'solid 1px rgba(76, 47, 252, 0.23)',
    borderRadius: '.3rem',
  },
  '& input.form-control.is-invalid': {
    background: 'none',
    border: `solid 1px ${theme.palette.danger.main}`,
  },
  '& input.form-control.is-invalid:focus': {
    background: 'none',
    border: `solid 1px ${theme.palette.danger.main}`,
  },
  '& input.form-control.is-invalid ~ li, input.form-control.is-invalid ~ div.MuiOutlinedInput-root': {
    borderColor: theme.palette.danger.main,
  },
  '& input.form-control.is-invalid:focus ~ li, input.form-control.is-invalid:focus ~ div.MuiOutlinedInput-root': {
    border: `solid 1px ${(props) => props.theme.palette.danger.main}`,
  },
  '& input.form-control:focus': {
    outline: 'none',
    border: `solid 1px ${theme.palette.primary.main}`,
    boxShadow: 'none',
  },
  '& h6.availableAmount': {
    position: 'absolute',
    bottom: '-20px',
    left: '4px',
    display: 'table',
    fontSize: '12px',
    color: 'grey',
    transition: 'bottom .23s linear',
  },
  '& li': {
    position: 'absolute',
    width: '103.56px',
    height: '56px',
    top: 0,
    right: 0,
    border: 'solid 1px rgba(76, 47, 252, 0.23)',
    borderRadius: '.3rem',
    borderTopLeftRadius: '2rem',
    borderBottomLeftRadius: '2rem',
    zIndex: '-1',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& svg': {
      width: '26px',
      height: '26px',
      margin: 0,
    },
    '& img': {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      margin: 0,
    },
    '& > div.MuiBox-root > div.MuiBox-root:nth-of-type(1)': {
      padding: '.6rem',
      margin: 0,
      marginRight: '.55rem',
      backgroundColor: 'rgba(76, 47, 252, 0.1)',
      border: 'solid 1px #ddd',
      borderRadius: '50%',
    },
  },
  '& > span.errorMessage': {
    position: 'absolute',
    display: 'table',
    content: '""',
    left: '4px',
    bottom: '-10px',
    lineHeight: 0,
    color: theme.palette.danger.main,
    transition: 'transform .3s linear, opacity .3s linear',
    fontSize: '10.5px',
    transform: 'translateY(-7px)',
    opacity: 0,
  },
  '& > span.errorMessage:first-letter': {
    textTransform: 'uppercase',
  },
  '&.invalid > span.errorMessage': {
    transform: 'translateY(0px)',
    opacity: 1,
  },
  '&.invalid h6.availableAmount': {
    transition: 'bottom .3s linear',
    bottom: '-36px',
  },
}));

export const DepositDoneAction = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  border: 'none',
  color: '#ffff',
}));

export const ActionResponseButton = styled(MainButton)(() => ({
  width: '100%',
  height: '48px',
  boxShadow: 'none',
}));

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

export const StakingSearchBar = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiFilledInput-root:before': {
    borderBottom: `1px solid ${theme.palette.divider.main}`,
  },
  '& .MuiFilledInput-root:after': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiFilledInput-input': {
    padding: '1rem 0',
  },
  '&:hover': {
    '& .MuiFilledInput-root:before': {
      borderColor: theme.palette.secondary.main,
    },
  },
}));

export const ProposeAddressInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  '&.isAddressError': {
    '& fieldset': {
      borderColor: theme.palette.danger.main,
    },
  },
}));

export const ModalContainer = styled(Modal)(() => ({
  '&.isSendTokenModal ~ .MuiPopover-root > .MuiPaper-root': {
    left: 'calc(50% - 1px)',
  },
  '&.isUnstakeTokenModal ~ .MuiPopover-root > .MuiPaper-root': {
    left: 'calc(50% - 228px)',
    top: 'calc(50% + 5px)',
  },
}));

export const RemoveItemsButton = styled(MainButton)(() => ({
  minWidth: '56px',
  height: '56px',
  padding: 0,
  boxShadow: 'none',
}));

export const FormikRoundedCheckBox = styled(Box)(({ theme }) => ({
  margin: '7px 0',
  display: 'flex',
  alignItems: 'center',
  '& input[type="checkbox"]': {
    appearance: 'none',
    position: 'relative',
    width: '25px',
    height: '25px',
    border: `solid 1px ${theme.palette.divider.main}`,
    borderRadius: '.2rem',
    transition: '300ms all ease-in-out',
  },
  '& input[type="checkbox"]:hover': {
    borderColor: theme.palette.primary.main,
  },
  '& input[type="checkbox"]:focus': {
    outline: 'none',
  },
  '& input[type="checkbox"]:checked': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  'input[type="checkbox"]:before': {
    position: 'absolute',
    content: '""',
    width: '12px',
    height: '12px',
    top: '6px',
    left: '5px',
    transform: 'scale(0)',
    transition: '300ms all ease-in-out',
    boxShadow: `inset 1em 1em ${theme.palette.background.white}`,
    clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)',
  },
  'input[type="checkbox"]:checked:before': {
    transform: 'scale(1)',
  },
  '& label': {
    marginLeft: '5px',
    fontSize: '15px',
  },
}));

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
