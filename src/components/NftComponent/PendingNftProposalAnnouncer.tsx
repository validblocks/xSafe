import React from 'react';
import { Box } from '@mui/material';
import { Text } from '../StyledComponents/StyledComponents';

const PendingNftProposalAnnouncer = () => (
  <Box
    sx={{
      position: 'absolute',
      color: '#fff',
      left: '-10px',
      top: '-13px',
      zIndex: '1',
      display: 'flex',
      padding: '5px 10px',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#4c2FFC',
      borderRadius: '6px',
      cursor: 'pointer',
    }}
  >
    <Text fontSize="12px" fontWeight="700">Proposal pending</Text>
  </Box>
);

export default PendingNftProposalAnnouncer;
