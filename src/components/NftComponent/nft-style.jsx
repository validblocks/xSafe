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

export const TextDivider = styled.div`
  margin-top: 1rem;
  position: relative;
  &:before{
    position: absolute;
    content:'';
    width: 50%;
    height: 1px;
    bottom: -2px;
    background: #DFDFE8;
  }
  border-top: solid 1px #DFDFE8;
`;

export const CardBox = styled(Card)`
  height: ${(props) => props.height};
  width: 265px;
  padding: 1.25rem .65rem 0;
  border-radius: .7rem;
  box-shadow:
    0px 2px 10px rgba(76, 47, 252, 0.03),
    0px 3px 12px rgba(76, 47, 252, 0.03);
`;
