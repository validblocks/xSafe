import Card from '@mui/material/Card';
import styled from 'styled-components';

export const CardBox = styled(Card)`
&&& {
  height: ${(props) => props.height};
  /* max-width: 250px; */
  /* margin: 0 20px 20px 20px; */
  border-radius: 4px;
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
      font-size: 14px !important;
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
