import { Box, Grid } from '@mui/material';
import styled from 'styled-components';

export const ModalCardTitleContainer = styled(Box)`
  padding: '2rem 3rem';
  border: 1px solid ${(props) => props.theme.palette.divider.main};
`;

export const StyledStakingProvider = styled(Grid)`
  border: 1px solid ${(props) => props.theme.palette.borders.secondary};
  padding: .5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
`;
