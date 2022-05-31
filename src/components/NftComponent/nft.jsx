import { Divider } from '@mui/material';
import styled from 'styled-components';

export const EmptyList = styled.p`
  font-size: 15px !important;
  font-weight: 600 !important;
  opacity: 0.5;
`;

export const Img = styled.img`
  width: 150px;
`;

export const CollectionName = styled.div`
  width: 100%;
`;

export const TextDivider = styled(Divider)`
  &:before {
    content: '';
    width: 1% !important;
  }
`;
