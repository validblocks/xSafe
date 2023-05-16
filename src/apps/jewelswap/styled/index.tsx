import { Box, Card } from '@mui/material';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import styled from 'styled-components';

export const NFTMarketplaceCard = styled(Card)(({ theme }) => ({
  '&&&': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: 'none',
    transition: 'all .2s linear',
    minWidth: '250px',
    backgroundColor: theme.palette.background.secondary,
  },
}));

export const NFTMarketplaceImgContainer = styled(Box)(({ theme }) => ({
  '&&&': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#14131C',
    color: theme.palette.text.homeCards,
    borderRadius: '10px',
    minHeight: '125px',
  },
}));

export const NFTMarketplaceDescription = styled(Text)(({ theme }) => ({
  '&&&': {
    color: theme.palette.text.homeCards,
    fontWeight: 500,
    textAlign: 'justify',
  },
}));

export const ImageText = styled(Text)(({ theme }) => ({
  '&&&': {
    color: theme.palette.text.homeCards,
    fontWeight: 500,
    textAlign: 'justify',
  },
}));
