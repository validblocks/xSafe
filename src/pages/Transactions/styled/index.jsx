import { Box } from '@mui/material';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import styled from 'styled-components';

export const ActionSummaryContainer = styled(Box)(({ theme: _ }) => ({
  display: 'grid',
  width: '100%',
  '@media (min-width: 1300px)': {
    gridTemplateColumns: '60px 150px 150px 500px auto',
    gridTemplateAreas: '"actionIdBox actionTitleBox actionSignersBox actionCreatorBox actionStatusBox"',
  },
  '@media (max-width: 1300px)': {
    gridTemplateColumns: '60px 150px 4fr 1fr',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: '"actionIdBox actionTitleBox actionSignersBox actionStatusBox" "actionCreatorBox actionCreatorBox actionCreatorBox actionStatusBox"',
  },
  '@media (max-width: 600px)': {
    gridTemplateColumns: '34px 110px 110px auto',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: '"actionIdBox actionTitleBox actionSignersBox actionStatusBox" "actionCreatorBox actionCreatorBox actionCreatorBox actionCreatorBox"',
  },
}));

export const ActionIdBox = styled(CenteredBox)`
  padding: 1rem;
  width: 60px;
  grid-area: actionIdBox;
  @media (max-width: 600px) {
    width: 100%;
    padding: 5px 9px;
    & > p{
      font-size: 13px;
    }
  }
`;

export const ActionTitleBox = styled(Box)`
  display: flex;
  justify-content: start;
  align-items: center;
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 14px 8px;
  font-weight: bold;
  min-width: 150px;
  font-size: 17px;
  grid-area: actionTitleBox;
  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
    padding: 5px 9px;
    & > p{
      font-size: 13px;
    }
  }
`;

export const ActionSignersBox = styled(CenteredBox)`
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 150px;
  grid-area: actionSignersBox;
  @media (max-width: 1300px){
    & div {
      display: flex;
      flex-direction: row;
      & > strong {
        margin-right: 5px;
      }
    };
  };
  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
    padding: 5px 9px;
    & > p{
      font-size: 13px;
    }
  };
`;

export const ActionCreatorBox = styled(Box)`
  padding: 1rem;
  font-size: 0.85rem;
  min-width: 250px;
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  grid-area: actionCreatorBox;
  & .MuiTypography-root {
    min-width: 79px;
    margin-bottom: .25rem;
  };
  & div {
    display: flex;
    flex-direction: row;
  }
  @media (max-width: 1300px) {
    border-top: solid 1px ${(props) => props.theme.palette.divider.secondary};
    border-left: none;
    border-bottom: none;
    display: flex;
    flex-direction: row;
    & .MuiTypography-root {
      min-width: 79px;
      margin-bottom: 0;
    };
  };
  @media (max-width: 600px){
    & .MuiTypography-root span {
      font-size: 13px;
    }
    & .MuiTypography-root .trim .left, & .MuiTypography-root .trim .right {
      font-size: 1px;
    }
  };
`;

export const ActionStatusBox = styled(Box)`
  display: flex;
  justify-content: flex-end;
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-size: 15px;
  grid-area: actionStatusBox;
  @media (max-width: 1300px) {
    padding-right: 0;
  }
  @media (max-width: 600px) {
    padding: 5px 9px;
    padding-right: 0;
    justify-content: flex-start;
  }
`;

export const PendingContainerBox = styled(Box)`
  background-color: #FF8946;
  color: ${(props) => props.theme.palette.button.pending};
  border-radius: 4px;
  padding: 2px 6px;
  font-weight: bold;
`;

export const SuccesContainerBox = styled(PendingContainerBox)`
  background-color: ${(props) => props.theme.palette.button.success};
  color: ${(props) => props.theme.palette.text.success};
`;
