import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import { InputsContainer, TokenSelect } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';

export const TokenSelection = styled(TokenSelect)<any>(({ theme: _ }) => ({
  top: '0px',
  right: '0px',
  height: '56px',
  width: '145px',
  px: '5rem',
  borderLeft: 'solid 1px rgba(76, 47, 252, 0.23)',
  borderTop: 'none !important',
  borderRight: 'none !important',
  borderBottom: 'none !important',
  borderTopLeftRadius: '5rem',
  borderBottomLeftRadius: '5rem',
  '&.invalid': {
    borderColor: '#e51a3e !important',
    color: '#e51a3e !important',
  },
  flex: '0.7',
  fieldset: {
    border: 'none',
  },
  '.MuiSelect-select': {
    padding: '.1rem .7rem',
    '& div.MuiBox-root > div.MuiBox-root:nth-child(3)': {
      display: 'none',
    },
  },
}));

export const SelectProposalTypesModalContainer = styled(Box)(({ theme: _ }) => ({
  padding: '30px 40px 0',
  '@media (max-width:600px)': {
    padding: '16px 16px 0',
  },
}));

export const AttachSmartContractModalContainer = styled(Box)(({ theme: _ }) => ({
  padding: '30px 40px',
  '@media (max-width:600px)': {
    padding: '16px',
  },
}));

export const AmountWithTokenSelectionBox = styled(InputsContainer)(({ theme }) => ({
  display: 'flex',
  marginBottom: '30px !important',
  border: '1px solid #eee',
  borderColor: theme.palette.borders.secondary,
  borderRadius: '4px',
  '&.invalid': {
    marginBottom: '36px !important',
    borderColor: '#e51a3e !important',
    color: '#e51a3e !important',
  },
  '& input': {
    border: 'none',
    outline: 'none',
    color: theme.palette.text.secondary,
    padding: '0 1rem',
  },
  '& label': {
    color: theme.palette.borders.active,
  },
  '& label.isError': {
    color: '#e51a3e !important',
  },
  '&:hover': {
    borderColor: theme.palette.borders.active,
    '.egld-staked': {
      borderLeft: `1px solid ${theme.palette.borders.active}`,
    },
  },
  '&:focus-within': {
    borderColor: theme.palette.borders.active,
    color: theme.palette.borders.active,
  },

}));

export const DataTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: '0.42rem 0 1.70rem !important',
  label: {
    marginBottom: 0,
    fontSize: '15px',
    left: '-1px',
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-root fieldset': {
    transition: 'all .3s linear',
    borderColor: theme.palette.borders.secondary,
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.borders.active,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-root.Mui-focused fieldset': {
    transition: 'all .3s linear',
    borderColor: theme.palette.borders.active,
    borderWidth: '1px',
  },
  '& label.MuiInputLabel-root.Mui-focused': {
    color: theme.palette.borders.active,
  },

}));
