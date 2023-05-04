import { Box } from '@mui/system';
import React from 'react';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import FrameitLogo from '../../assets/img/frameit_logo.svg';

const FrameItLogo = () => (
  <Box display="flex">
    <img height="25" src={FrameitLogo} alt="Frame It" />
    <Text
      fontSize={16}
      fontWeight={600}
      marginLeft={1}
      sx={{
        color: 'rgba(255, 255, 255, 0.9)',
      }}
    >Frame it
    </Text>
  </Box>
);

export default FrameItLogo;
