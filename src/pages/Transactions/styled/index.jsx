import { Box } from '@mui/material';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import styled from 'styled-components';

export const ActionIdBox = styled(CenteredBox)`
  border-right: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  width: 60px !important;
`;

export const ActionTitleBox = styled(Box)`
  display: flex;
  justify-content: start;
  align-items: center;
  border-right: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-weight: bold;
  min-width: 230px;
`;

export const ActionSignersBox = styled(CenteredBox)`
  border-right: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  min-width: 150px;
`;

export const ActionCreatorBox = styled(Box)`
  padding: 1rem;
  font-size: 0.85rem;
  min-width: 250px;
  flex: 1;
`;

export const ActionPendingBox = styled(Box)`
  display: flex;
  border-left: 1px solid ${(props) => props.theme.palette.divider.secondary};
  padding: 1rem;
  font-size: 0.85rem;
`;

export const PendingContainerBox = styled(Box)`
  background-color: #f8c651;
  color: ${(props) => props.theme.palette.button.pending};
  border-radius: 4px;
  padding: 0.5rem 0.675rem;
  font-weight: bold;
`;
