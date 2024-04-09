import { Grid } from '@mui/material';
import styled from 'styled-components';

export const StyledStakingProvider = styled(Grid)`
  border: 1px solid ${(props) => props.theme.palette.borders.secondary};
  padding: 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
`;
