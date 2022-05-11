import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './ChangeCurrency.scss';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

const ChangeCurrency = ({ closeCurrencyDropdown }: any) => {
  interface CountryType {
    code: string;
    label: string;
    suggested?: boolean;
  }
  const text = 'asd';
  const countries: readonly CountryType[] = [
    { code: 'US', label: 'USD' },
    { code: 'EU', label: 'EUR' }
  ];
  return (
    <Box
      className='change-currency-wrapper'
      onBlur={() => {
        closeCurrencyDropdown(false);
      }}
    >
      <Typography sx={{ p: 2 }} align='left'>
        Change Currency
      </Typography>
      <Divider />
      <Box>
        <Autocomplete
          id='country-select-demo'
          sx={{ width: 200 }}
          options={countries}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <Box
              component='li'
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading='lazy'
                width='20'
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                alt=''
              />
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <div>
              <SearchIcon className='search-icon' />
              <TextField
                {...params}
                className='currency-input'
                label='Search...'
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password' // disable autocomplete and autofill
                }}
              />
            </div>
          )}
        />
      </Box>
    </Box>
  );
};

export default ChangeCurrency;
