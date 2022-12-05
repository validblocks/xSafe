import { Card } from 'react-bootstrap';
import { MainButton } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';

export const InstallButton = styled(MainButton)(({ theme }) => ({
  '&&&': {
    width: '100%',
    fontSize: '15px',
    fontWeight: '400 !important',
    textTransform: 'none',
    color: theme.palette.primary.main,
    boxShadow: 'none !important',
    '&:disabled': {
      backgroundColor: theme.palette.background.disabled,
      borderColor: theme.palette.background.disabled,
      color: theme.palette.text.disabled,
    },
  },
}));

export const AppCard = styled(Card)(({ theme }) => ({
  '&&&': {
    padding: '15px',
    width: '310px',
    height: 'auto',
    boxShadow: `0px 14px 24px ${theme.shadows.reducedOpacity}`,
    display: 'flex',
    flexDirection: 'column',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: theme.palette.background.secondary,
    '@media (max-width:600px)': {
      width: '100%',
      height: '100%',
    },
  },
}));
