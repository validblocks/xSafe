import React from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { Typography, Box } from '@mui/material';

const DecisionApproved = () => {
  return (
    <Box className='d-flex justify-content-center'>
      <ThumbUpOutlinedIcon />
      <Typography>You approved this decision</Typography>
    </Box>
  );
};

export default DecisionApproved;
