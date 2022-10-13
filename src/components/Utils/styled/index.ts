import { Box } from '@mui/material';
import styled from 'styled-components';

export const ContainerWithPanelsTopBox = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    width: '100%',
    padding: '0 1rem',
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
