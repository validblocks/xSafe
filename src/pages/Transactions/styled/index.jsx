import { Box } from '@mui/material';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import styled from 'styled-components';

export const PendingActionSummaryContainer = styled(Box)(({ theme: _ }) => ({
  display: 'grid',
  width: '100%',
  '@media (min-width: 1300px)': {
    gridTemplateColumns: '60px 150px 150px 500px auto',
    gridTemplateAreas: '"actionIdBox actionTitleBox actionSignersBox actionCreatorBox actionPendingBox"',
  },
  '@media (max-width: 1300px)': {
    gridTemplateColumns: '60px 150px 1fr 2fr',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: '"actionIdBox actionTitleBox actionSignersBox actionPendingBox" "actionCreatorBox actionCreatorBox actionCreatorBox actionCreatorBox"',
  },
}));

export const ActionIdBox = styled(CenteredBox)`
  padding: 1rem;
  width: 60px;
  grid-area: actionIdBox;
`;

export const ActionTitleBox = styled(Box)`
  display: flex;
  justify-content: start;
  align-items: center;
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-weight: bold;
  min-width: 150px;
  grid-area: actionTitleBox;
`;

export const ActionSignersBox = styled(CenteredBox)`
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  min-width: 150px;
  grid-area: actionSignersBox;
`;

export const ActionCreatorBox = styled(Box)`
  padding: 1rem;
  font-size: 0.85rem;
  min-width: 250px;
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  flex: 1;
  grid-area: actionCreatorBox;
  @media (max-width: 1300px) {
    border: solid 1px ${(props) => props.theme.palette.divider.secondary};
    border-left: none;
    border-bottom: none;
  };
`;

export const ActionPendingBox = styled(Box)`
  display: flex;
  justify-content: flex-end;
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-size: 0.85rem;
  grid-area: actionPendingBox;
  @media (max-width: 1300px) {
    border-right: solid 1px ${(props) => props.theme.palette.divider.secondary};
  };
`;

export const PendingContainerBox = styled(Box)`
  background-color: #f8c651;
  color: ${(props) => props.theme.palette.button.pending};
  border-radius: 4px;
  padding: 0.5rem 0.675rem;
  font-weight: bold;
`;
