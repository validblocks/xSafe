import { Box, Link, Tabs } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { DataGrid } from '@mui/x-data-grid';
import styled from 'styled-components';

export const ContainerWithPanelsTopBox = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    width: '100%',
    padding: '0 1rem',
  },
}));

export const CopyIconLink = styled(Link)(({ theme: _ }) => ({
  '&.MuiTypography-root': {
    color: '#6c757d !important',
  },
  '&.MuiTypography-root.icon-purple': {
    color: '#4c2ffc8a !important',
  },
}));

export const QrCodeReceive = styled(QrCode2Icon)(({ theme: _ }) => ({
  color: `${_.palette.anchor.secondary}`,
  '&.details-card': {
    margin: '0 5px 1px 0',
    fontSize: '16px',
    color: `${_.palette.primary.main}`,
  },
}));

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
      backgroundColor: '#F5F7FF',
      '& .MuiButton-root': {
        opacity: '1',
      },
    },
    '& p': {
      margin: 0,
      color: 'rgba(0, 0, 0, 0.6)',
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
    '&.organization-owners': {
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
        fill: `${theme.palette.primary.main}`,
      },
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
    borderBottom: `2px solid ${theme.palette.divider.main} !important`,
  },
}));

export const MainTab = styled(Tabs)(({ theme: _ }) => ({
  '&&&': {
    '& .MuiButtonBase-root': {
      color: `${_.palette.primary.main}`,
      fontWeight: `${_.font.weight.lg}`,
      fontSize: '13px',
      textTransform: 'capitalize',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: `${_.palette.primary.main}`,
      boxShadow: `0px 0px 2px ${_.palette.primary.main}`,
    },
  },
}));
