import Card from '@mui/material/Card';
import styled from 'styled-components';

export const EmptyList = styled.p`
  font-size: 15px !important;
  font-weight: 600 !important;
  opacity: 0.5;
  color: ${(props) => props.theme.palette.text.secondary}
`;

export const CollectionName = styled.div`
  width: 100%;
  padding-bottom: 24px;
  color: ${(props) => props.theme.palette.text.primary}
`;

export const TextDivider = styled.div`
  margin-top: 0;
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
  max-width: 250px;
  /* margin: 0 20px 20px 20px; */
  border-radius: .7rem;
  box-shadow: none;
  transition: all .2s linear;
  transform: scale(1);
  overflow: visible;
  background-color: ${(props) => props.theme.palette.background.secondary};
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
    @media (min-width: 600px){
      /* position: absolute; */
      /* width: 225.63px; */
      transform: translateY(85px);
      /* bottom: -50px; */
      transition: all .2s linear;

      &:disabled {
        background-color: ${(props) => props.theme.palette.background.disabled};
        border-color: ${(props) => props.theme.palette.background.disabled};
        color: ${(props) => props.theme.palette.text.disabled};
      },
    },
  };
  &:hover{
    @media (min-width: 600px){
      & span {
        top: 13px;
        font-size: 15px;
      };
      & button {
        transform: translateY(35px);
      };
    }
  };
  @media (max-width: 600px){
    width: 100%;
    margin: 0;
    text-align: left;
    & button {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
      bottom: initial;
      left: initial;
      align-items: center;
      justify-content: center;
    }
    & span {
      position: relative;
      padding-left: 3px;
      top: initial;
      left: initial;
      font-size: 15px;
    }
    &:hover{
      & span {
        top: initial;
        font-size: 15px;
      };
      & button {
        bottom: initial;
      };
    };
  }
}
`;
