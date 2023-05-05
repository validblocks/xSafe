import { Box } from '@mui/system';
import React from 'react';

type Props = {
  svgUrl: string;
};
const GridIcon = ({ svgUrl }: Props) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '0.5rem',
      padding: '0.5rem',
      backgroundColor: 'rgba(76,47, 252, 0.1)',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '33px',
      height: '33px',
    }}
  >
    <img src={svgUrl} alt="grid-icon" />
  </Box>
);

export default GridIcon;
