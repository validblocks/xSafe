import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import styled from 'styled-components';

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
    },
    '.MuiDataGrid-actionsCell': {
      paddingLeft: '20px',
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: 'none',
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
  },
}));

export const NoRowsOverlay = styled(GridOverlay)(({ theme: _ }) => ({
  backgroundColor: _.palette.background.secondary,
  borderBottom: `solid 1px ${_.palette.divider.secondary}`,
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
