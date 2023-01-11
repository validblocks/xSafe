import styled from 'styled-components';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export const ArrowToRight = styled(KeyboardBackspaceIcon)(({ theme: _ }) => ({
  color: _.palette.background.arrow,
  transform: 'rotate(180deg)',
  marginLeft: 'auto',
}));

export const MultisigLink = styled.a(({ theme: _ }) => ({
  textDecoration: 'underline',
  color: _.palette.primary.main,
  transition: 'color 200ms linear',
  '&:hover': {
    color: _.palette.hover.link,
  },
}));
