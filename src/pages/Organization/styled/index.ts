import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import styled from 'styled-components';
import { Button } from '@mui/material';
import pxToRem from 'src/components/Utils/pxToRem';

export const MainTable = styled(DataGrid)(({ theme }) => ({
  '&&&': {
    width: '100%',
    borderRadius: '10px',
    boxShadow:
      '0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03)',
    backgroundColor: theme.palette.background.secondary,
    border: 'none',
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-columnHeader': {
      padding: '5px 0 0 20px',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: theme.palette.background.hover,
      '& .MuiButton-root': {
        opacity: '1',
      },
    },
    '& .MuiButtonBase-root:hover': {
      backgroundColor: theme.palette.hover.secondary,
      '& svg': {
        fill: '#4C2FFC',
        opacity: '1 !important',
        transition: 'none',
      },
    },
    '& div, & p.MuiTablePagination-displayedRows': {
      color: theme.palette.text.tableHeaders,
    },
    '& p': {
      margin: 0,
    },
    '& span': {
      fontSize: '12px',
      color: `${theme.palette.text.secondary} !important`,
    },
    '& svg': {
      color: theme.palette.text.primary,
    },
    '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-cell': {
      borderBottomColor: theme.palette.divider.secondary,
    },
    '& .MuiDataGrid-cell': {
      paddingLeft: '9px',
      '& strong': {
        color: theme.palette.text.primary,
        paddingLeft: '11px',
        fontWeight: '600',
      },
      '& p': {
        color: `${theme.palette.text.primary} !important`,
      },
    },
    '.MuiDataGrid-actionsCell': {
      paddingLeft: '20px',
    },
    '& .MuiDataGrid-footerContainer': {
      borderTopColor: theme.palette.divider.secondary,
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
        color: 'rgba(76, 47, 252, 0.54)',
      },
    },
    '& .MuiDataGrid-footerContainer > div.MuiDataGrid-selectedRowCount': {
      opacity: '0',
    },
  },
}));

export const NoRowsOverlay = styled(GridOverlay)(({ theme: _ }) => ({
  '&&&': {
    backgroundColor: _.palette.background.secondary,
    borderBottom: `solid 1px ${_.palette.divider.secondary}`,
  },
}));

export const MobileCardOfTokens = styled(Box)(({ theme: _ }) => ({
  width: '100%',
  marginBottom: '12px',
  padding: '20px',
  backgroundColor: _.palette.background.secondary,
  display: 'flex',
  borderRadius: '10px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '& li': {
    padding: '0',
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      width: '19px',
      height: '19px',
    },
  },
}));

export const SvgBox = styled(Box)(({ theme: _ }) => ({
  '& svg path': {
    borderRadius: '4px',
  },
}));

export const MobileCardOfMembers = styled(MobileCardOfTokens)`
  flex-direction: row;
`;
export const CategoryName = styled.div(({ theme: _ }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& strong': {
    marginLeft: '5px',
    color: _.palette.text.primary,
  },
  '& span': {
    marginBottom: '8px',
    color: _.palette.text.menuItems,
  },
  '& h6': {
    lineHeight: '1.35',
    color: _.palette.text.primary,
  },
}));

export const TokenDetailsBox = styled.div(({ theme: _ }) => ({
  display: 'flex',
  flexDirection: 'row',
  '& div:nth-of-type(1)': {
    width: '100px',
  },
  '& div:nth-of-type(2)': {
    marginRight: 'auto',
  },
  '@media (min-width: 472px)': {
    '& div:nth-of-type(1)': {
      marginRight: 'calc(8.5% + 10px)',
      width: 'calc(100px + 1.3%)',
    },
  },
}));

export const ActionButtonsBox = styled.div(({ theme: _ }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: '10px',
  '& button': {
    width: '100%',
  },
}));

export const CvorumContainer = styled.div(({ theme: _ }) => ({
  width: '405px',
  padding: '30px',
  backgroundColor: _.palette.background.secondary,
  borderRadius: '10px',
  boxShadow:
    '0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03)',
  '@media (max-width: 600px)': {
    width: '100%',
    padding: '16px',
  },
}));

export const QuorumCounterContainer = styled(Box)(({ theme: _ }) => ({
  display: 'inline-flex',
  marginTop: '14px',
  marginBottom: '24px',
  borderRadius: '10px',
  position: 'relative',
  backgroundColor: _.palette.background.quorumContent,
  '@media (max-width:600px)': {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
}));

export const QuorumCounterButton = styled(Button)(({ theme: _ }) => ({
  Width: '36px',
  height: '36px',
  backgroundColor: _.palette.background.quorumCounter,
  minWidth: '36px',
  padding: 0,
  '&.Mui-disabled': {
    backgroundColor: _.palette.background.disabled,
  },
  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: 0,
  },
  '& .MuiButton-startIcon>*:nth-of-type(1)': {
    fontSize: '28px',
    color: _.palette.svg.quorumCounter,
  },
  '&.Mui-disabled .MuiButton-startIcon>*:nth-of-type(1)': {
    color: _.palette.text.disabled,
  },
}));

export const QuorumContent = styled.span(({ theme: _ }) => ({
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: _.palette.text.quorumContent,
  fontSize: pxToRem(17),
  fontWeight: 600,
  fontFamily: 'IBM Plex Sans',
  '& span': {
    color: _.palette.text.quorumDigits,
    fontSize: pxToRem(17),
    fontWeight: 600,
    marginRight: '3px',
  },
  '@media (max-width: 600px)': {
    width: '100%',
  },
}));

export const QuorumErrorMessage = styled.span(({ theme: _ }) => ({
  position: 'absolute',
  width: 'calc(100% + 90px)',
  bottom: '-5px',
  left: '2px',
  color: _.palette.danger.main,
  fontSize: pxToRem(12),
  transition: 'bottom 300ms linear, opacity 300ms linear',
  opacity: 0,
  lineHeight: 1.1,
  '&.is-invalid': {
    opacity: 1,
    bottom: '-16px',
  },
}));

export const ActionButtonsBoxMembers = styled.div`
  display: flex;
  width: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  & button {
    padding: 0;
    min-width: 0;
    display: table;
    & span {
      margin-bottom: 0;
    }
    & .MuiButton-startIcon {
      margin-right: 0;
      margin-left: 0;
    }
  }
`;
