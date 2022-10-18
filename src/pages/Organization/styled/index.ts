import { DataGrid } from '@mui/x-data-grid';
import styled from 'styled-components';

export const MainTable = styled(DataGrid)(({ theme }) => ({
  '&&&': {
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
    '& div': {
      color: theme.palette.text.primary,
    },
    '& p': {
      margin: 0,
      color: `${theme.palette.text.primary} !important`,
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
