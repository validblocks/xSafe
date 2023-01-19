import { TimelineSeparator } from '@mui/lab';
import { Box } from '@mui/material';
import { CardBox } from 'src/components/NftComponent/nft-style';
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
  & > p {
    color: ${(props) => props.theme.palette.text.homeCards};
  }
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
  border-left: 1px solid ${(props) => props.theme.palette.divider.sidebar};
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
  border-left: 1px solid ${(props) => props.theme.palette.divider.sidebar};
  padding: 1rem;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 150px;
  grid-area: actionSignersBox;
  font-family: 'IBM Plex Sans', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-weight: 500;  
  span {
    color: ${(props) => props.theme.palette.text.homeCards};
  };
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
    & > p, & > span{
      font-size: 13px;
    }
  };
`;

export const ActionCreatorBox = styled(Box)`
  padding: 1rem;
  font-size: 0.85rem;
  min-width: 250px;
  border-left: 1px solid ${(props) => props.theme.palette.divider.sidebar};
  grid-area: actionCreatorBox;
  & > p {
    color: ${(props) => props.theme.palette.text.homeCards};
  }
  & .MuiTypography-root {
    min-width: 79px;
    margin-bottom: .25rem;
  };
  & div {
    display: flex;
    flex-direction: row;
  }
  @media (max-width: 1300px) {
    border-top: solid 1px ${(props) => props.theme.palette.divider.sidebar};
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
  justify-content: flex-start;
  border-left: 1px solid ${(props) => props.theme.palette.divider.sidebar};
  padding: 1rem 1rem 1rem 30px;
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

export const PendingContainerBox = styled(Box)(({ theme: _ }) => ({
  backgroundColor: _.palette.button.pending,
  color: _.palette.text.pending,
  borderRadius: '4px',
  padding: '2px 6px',
  fontWeight: _.font.weight.md,
  fontFamily: 'IBM Plex Sans, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
}));

export const SuccesContainerBox = styled(PendingContainerBox)`
  background-color: ${(props) => props.theme.palette.button.success};
  color: ${(props) => props.theme.palette.text.success};
`;

export const NoActionsOverlayCard = styled(CardBox)(({ theme: _ }) => ({
  '&&&': {
    height: '300px',
    width: '100%',
    maxWidth: '300px',
    margin: '12px 0 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    span: {
      color: _.palette.text.secondary,
      opacity: 0.5,
      fontSize: '15px',
      fontWeight: _.font.weight.lg,
      position: 'relative',
      top: 'auto',
      left: 'auto',
    },
    '&:hover': {
      span: {
        top: 'auto',
        left: 'auto',
        cursor: 'default',
      },
    },
    '@media (max-width:600px)': {
      maxWidth: '100%',
      marginTop: '20px',
    },
  },
}));

export const XSafeTimelineSeparator = styled(TimelineSeparator)(({ theme: _ }) => ({
  '& span.MuiTimelineConnector-root': {
    backgroundColor: _.palette.background.timelineConnector,
    width: '1px',
    height: '20px',
    maxHeight: '20px',
  },
}));
