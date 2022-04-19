import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Network = () => {
  const [age, setAge] = useState('mainnet');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
      {/* <InputLabel id='demo-select-small'>Mainnet</InputLabel> */}
      <Select
        labelId='demo-select-small'
        id='demo-select-small'
        value={age}
        defaultValue={age}
        label={age}
        onChange={handleChange}
      >
        {/* <MenuItem value=''>
          <em>None</em>
        </MenuItem> */}
        <MenuItem value={'mainnet'}>Mainnet</MenuItem>
        <MenuItem value={'devnet'}>Devnet</MenuItem>
        <MenuItem value={'testnet'}>Testnet</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Network;
