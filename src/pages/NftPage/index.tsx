import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import NftCompmonent from 'components/NftComponent';

function NftPage() {
  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      <NftCompmonent />
    </Box>
  );
}

export default NftPage;
