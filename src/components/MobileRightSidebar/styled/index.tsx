import { Dialog } from '@mui/material';
import styled from 'styled-components';

export const MobileRightSidebar = styled(Dialog)(({ theme: _ }) => ({
  '.MuiDialog-container': {
    height: 'calc(100% - 110.79px - 70px) !important',
    width: '100%',
    top: '110.79px',
    position: 'fixed',
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
