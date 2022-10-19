import { CardContent } from '@mui/material';
import { MainButton } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';

export const NftCardContent = styled(CardContent)(({ theme: _ }) => ({
  '&&&': {
    p: '.5rem .8rem 0.95rem !important',
    position: 'relative',
    overflow: 'hidden',
    height: '93px',
  },
}));

export const SendNFTButton = styled(MainButton)(({ theme: _ }) => ({
  '&&&': {
    width: '100%',
    fontWeight: '500 !important',
    boxShadow: 'none !important',
    mt: '.35rem',
    fontSize: '13px !important',
  },
}));
