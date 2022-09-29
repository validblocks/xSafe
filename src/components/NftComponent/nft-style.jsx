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
  margin-top: 0;
  margin-bottom: 2rem;
  position: relative;
  & .collectionLight{
    font-weight: 500;
    font-size: 11px;
    color: #7A7883; 
  }
  & div {
    display: flex;
    align-items: center;
    span:nth-child(1){
      font-size: 16px;
    }
    span:nth-child(2){
      margin: 0 0 1px .4rem;
      line-height: 1;
    }
    :after {
      content: '';
      width: 100%;
      height: 1px;
      margin: 1px 0 0 .4rem;
      background-color: #DFDFE8;
    }
  }
`;

export const CardBox = styled(Card)`
&&& {
  height: ${(props) => props.height};
  width: 250px;
  margin: 0 auto 1.6rem auto;
  border-radius: .7rem;
  box-shadow: none;
  transition: all .2s linear;
  transform: scale(1);
  overflow: hidden;
  & span {
    position: absolute;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    top: 35px;
    left: 0;
    transition: font-size .2s linear, top .2s linear;
  };
  & button {
    position: absolute;
    width: 225.63px;
    bottom: -50px;
    left: 11.2px;
    transition: bottom .2s linear;
  };
  &:hover{
    & span {
      top: 13px;
      font-size: 15px;
    };
    & button {
      bottom: 15px;
    };
  };
}
`;
