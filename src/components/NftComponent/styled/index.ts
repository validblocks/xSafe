import { Box, CardContent, CardMedia } from '@mui/material';
import { MainButton } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';
import { CardBox } from '../nft-style';

export const NftCardContent = styled(CardContent)(({ theme: _ }) => ({
  '&&&': {
    padding: '.5rem .8rem 0.95rem !important',
    position: 'relative',
    overflow: 'hidden',
    height: '93px',
    '@media (max-width: 600px)': {
      overflow: 'visible',
      height: 'auto',
    },
  },
}));

export const SendNFTButton = styled(MainButton)(({ theme: _ }) => ({
  '&&&': {
    width: '100%',
    fontWeight: '500 !important',
    boxShadow: 'none !important',
    marginTop: '.35rem',
    fontSize: '13px !important',
    position: 'relative',
  },
}));

export const CardMediaContainer = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    margin: '0',
    width: '100%',
    position: 'relative',
    zIndex: '0',
    '&:before': {
      position: 'absolute',
      content: '""',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(76, 47, 252, 0.1)',
    },
  },
}));

export const SftBalanceAnnouncer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 5,
  bottom: 5,
  background: theme.palette.background.secondary,
  borderRadius: '4px',
  padding: '8px',
  minWidth: '34px',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
}));

export const NftCardBox = styled(CardBox)(({ theme: _ }) => ({
  position: 'relative',
  borderRadius: '4px',
  cursor: 'pointer',
}));

export const NftCardMedia = styled(CardMedia)<any>(({ theme: _ }) => ({
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
}));
