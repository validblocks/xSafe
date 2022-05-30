import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const ThemeColor = () => {
  const themesList: string[] = ['Light', 'Dark'];
  const [value, setValue] = useState<string | null>(themesList[0]);

  return (
    <Box>
      <Autocomplete
        value={value}
        id='themes-states-demo'
        options={themesList}
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label='Theme' />}
      />
    </Box>
  );
};

export default ThemeColor;
