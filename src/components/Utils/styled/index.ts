import {
  Autocomplete,
  autocompleteClasses,
  Box,
  Popper,
  Link,
  Tabs,
  TextField as MuiTextField,
  MenuItem,
  Select,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { DataGrid } from '@mui/x-data-grid';
import styled from 'styled-components';
import Divider from '@mui/material/Divider';

export const ThemePrimaryBox = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    background: _.palette.background.default,
  },
}));

export const ThemePrimaryMenuItem = styled(MenuItem)(({ theme: _ }) => ({
  '&&&': {
    background: _.palette.background.default,
  },
}));

export const ContainerWithPanelsTopBox = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    width: '100%',
  },
}));

export const Dividers = styled(Divider)(({ theme: _ }) => ({
  borderColor: _.palette.divider.sidebar,
}));

export const CopyIconLink = styled(Link)(({ theme: _ }) => ({
  '&.MuiTypography-root svg > path': {
    fill: `${_.palette.anchor.secondary} !important`,
  },
}));

export const CopyIconLinkPurple = styled(CopyIconLink)(({ theme: _ }) => ({
  '&.MuiTypography-root svg > path': {
    fill: `${_.palette.anchor.main} !important`,
  },
}));

export const CopyIconLinkConnectedAccount = styled(CopyIconLink)(
  ({ theme: _ }) => ({
    '&.MuiTypography-root svg > path': {
      fill: `${_.palette.anchor.connectedAccount} !important`,
    },
  }),
);

export const QrCodeReceive = styled(QrCodeIcon)(({ theme: _ }) => ({
  color: '#6C757D !important',
}));

export const QrCodeReceivePurple = styled(QrCodeIcon)(({ theme: _ }) => ({
  margin: '0 5px 1px 0',
  fontSize: _.font.size.xxxl,
  color: _.palette.primary.main,
}));

export const MainTable = styled(DataGrid)(({ theme: _ }) => ({
  '&&&': {
    borderRadius: '10px',
    boxShadow: `${_.shadows.reducedOpacityIcons}, ${_.shadows.reducedOpacityIcons}`,
    backgroundColor: _.palette.background.secondary,
    border: 'none',
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-columnHeader': {
      padding: '5px 0 0 20px',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: _.hover.table.rows,
      '& .MuiButton-root': {
        opacity: '1',
      },
    },
    '& p': {
      margin: 0,
      color: _.palette.black.reducedOpacity,
    },
    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus-visible, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus-visible':
      {
        outline: 'transparent',
      },
    '& .MuiTablePagination-select': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '& .MuiInputBase-root': {
      margin: '0 8px',
    },
    '& .MuiTablePagination-actions': {
      marginLeft: '15px',
      '& button svg': {
        color: _.palette.secondary.main,
      },
    },
  },
}));

export const OwnersTable = styled(MainTable)(({ theme: _ }) => ({
  '&&&': {
    '& .MuiDataGrid-cell': {
      paddingLeft: '16px',
      '.MuiAvatar-root': {
        marginRight: '7px',
      },
    },
    '& .MuiDataGrid-cell > .MuiDataGrid-actionsCell': {
      marginLeft: '14px',
      gridGap: '2px',
      '.MuiButtonBase-root, .MuiButtonBase-root > svg': {
        transition: 'all 300ms linear',
      },
    },
    '& .MuiDataGrid-cell .MuiButtonBase-root:hover > svg': {
      fill: _.palette.primary.main,
    },
  },
}));

export const TabContainerBox = styled(Box)(({ theme }) => ({
  '&&&': {
    width: '100%',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `2px solid ${theme.palette.divider.secondary} !important`,
  },
}));

export const MultisigAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '&&&': {
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      color: theme.palette.text.primary,
      '& fieldset': {
        borderColor: theme.palette.borders.secondary,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.borders.active,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.borders.active,
      },
      '& .MuiAutocomplete-endAdornment': {
        '& button': {
          '& svg': {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    '& .MuiInputLabel-root,& .MuiInputLabel-formControl': {
      color: theme.palette.text.primary,
      zIndex: 0,
    },
    '& .MuiAutocomplete-popper': {
      color: theme.palette.text.primary,
    },
  },
}));

export const MultisigSelect = styled(Select)(({ theme }) => ({
  ul: {
    backgroundColor: `${theme.palette.background.default} !important`,
  },
  '.MuiList-root': {
    backgroundColor: `${theme.palette.background.default} !important`,
  },
  '.MuiPaper-root .MuiList-root': {
    backgroundColor: `${theme.palette.background.default} !important`,
  },
  '.MuiPaper-root ul': {
    backgroundColor: `${theme.palette.background.default} !important`,
  },
  '.UnstakeTokensListOpened': {
    backgroundColor: 'red !important',
  },
  '&&&': {
    '.MuiPaper-root .MuiList-root': {
      backgroundColor: `${theme.palette.background.default} !important`,
    },
    ul: {
      backgroundColor: `${theme.palette.background.default} !important`,
      '.MuiList-root': {
        backgroundColor: `${theme.palette.background.default} !important`,
      },
    },

    position: 'relative',
    '& .MuiOutlinedInput-root': {
      color: theme.palette.text.primary,
      '& fieldset': {
        borderColor: theme.palette.borders.secondary,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.borders.active,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.borders.active,
      },
      '& .MuiAutocomplete-endAdornment': {
        '& button': {
          '& svg': {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    '& .MuiInputLabel-root,& .MuiInputLabel-formControl': {
      color: theme.palette.text.primary,
      zIndex: 0,
    },
    '& .MuiAutocomplete-popper': {
      color: theme.palette.text.primary,
    },
  },
}));

export const MultisigPopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.secondary,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.background.secondary}`,
    boxShadow: 'none',
  },
}));

export const MainTab = styled(Tabs)(({ theme: _ }) => ({
  '&&&': {
    '& .MuiButtonBase-root': {
      color: _.palette.primary.main,
      fontWeight: _.font.weight.lg,
      fontSize: _.font.size.lg,
      textTransform: 'capitalize',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: _.palette.primary.main,
      boxShadow: `0px 0px 2px ${_.palette.primary.main}`,
    },
  },
}));

export const MultistepForm = styled(Box)(({ theme }) => ({
  '&&&': {
    backgroundColor: theme.palette.background.secondary,
    '& .MuiSvgIcon-root': {
      color: theme.palette.text.primary,
    },
  },
}));

export const TextField = styled(MuiTextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.secondary,
  color: theme.palette.text.primary,
  borderColor: theme.palette.borders.secondary,
  fieldset: {
    border: 'none ',
  },
}));
