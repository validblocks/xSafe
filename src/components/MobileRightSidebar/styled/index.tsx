import { Dialog } from '@mui/material';
import styled from 'styled-components';

export const MobileRightSidebar = styled(Dialog)(({ theme: _ }) => ({
  '.MuiDialog-container': {
    height: '90%',
    width: '100%',
    top: '110px',
    position: 'fixed',
    paddingTop: '1rem',
    paddingBottom: '134px',
    overflow: 'auto !important',
  },
  '.MuiModal-root .MuiDialog-root': {
    zIndex: '2 !important',
  },
  '.MuiPaper-root': {
    background: _.palette.background.default,
    borderRadius: '10px',
  },
}));
