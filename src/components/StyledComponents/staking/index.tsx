import { Box } from '@mui/material';
import styled from 'styled-components';

export const ModalCardTitleContainer = styled(Box)`
  padding: '2rem 3rem';
  border: 1px solid ${(props) => props.theme.palette.divider.main};
`;
