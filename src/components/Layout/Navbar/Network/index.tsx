import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import './network.scss';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function Network() {
  const [age, setAge] = useState('mainnet');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl
      sx={{ m: 1, minWidth: 120 }}
      size='small'
      className='network-wrapper'
    >
      <Select
        labelId='demo-select-small'
        id='demo-select-small'
        value={age}
        defaultValue={age}
        label={age}
        onChange={handleChange}
      >
        <MenuItem value='mainnet'>Mainnet</MenuItem>
        <MenuItem value='devnet'>Devnet</MenuItem>
        <MenuItem value='testnet'>Testnet</MenuItem>
      </Select>
    </FormControl>
  );
}

export default Network;
