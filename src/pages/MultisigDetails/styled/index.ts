import { Box } from '@mui/material';
import { MainButtonNoShadow } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';

export const CardButton = styled(MainButtonNoShadow)`
  &&& {
    width: 100%;
    font-size: 14px;
    font-weight: 400 !important;
    padding-left: 4px !important;
    margin-top: 1rem;
  }
`;

export const DetailsCardContainerBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 12px 0;
  gap: 12px;
`;
