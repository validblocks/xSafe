import { Divider } from '@mui/material';
import Card from '@mui/material/Card';
import styled from 'styled-components';

export const EmptyList = styled.p`
  font-size: 15px !important;
  font-weight: 600 !important;
  opacity: 0.5;
`;

export const CollectionName = styled.div`
  width: 100%;
`;

export const TextDivider = styled(Divider)`
  &:before {
    content: '';
    width: 1%;
  }
`;

export const CardBox = styled(Card)`
  height: ${(props) => props.height};
  width: 270px;
  padding: .25rem .3rem 0 .3rem;
  border-radius: .7rem;
  box-shadow:
    0px 2px 10px rgba(76, 47, 252, 0.03),
    0px 3px 12px rgba(76, 47, 252, 0.03);
`;
