import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import './ChangeCurrency.scss';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { selectedCurrencySelector } from 'redux/selectors/currencySelector';

const ChangeCurrency = ({ setCurrencyFromChild }: any) => {
  interface CountryType {
    code: string;
    label: string;
    suggested?: boolean;
  }
  const currencyList: CountryType[] = [
    { code: 'US', label: 'USD' },
    { code: 'EU', label: 'EUR' },
    { code: 'RO', label: 'RON' }
  ];

  const getCurrency = useSelector(selectedCurrencySelector);

  return (
    <Box>
      <Box>
        <Autocomplete
          onInputChange={(event, newInputValue) => {
            setCurrencyFromChild(newInputValue);
          }}
          value={{ code: '', label: `${getCurrency}` }}
          id='country-select-demo'
          sx={{ width: 250 }}
          options={currencyList}
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
              />
            </div>
          )}
        />
      </Box>
    </Box>
  );
};

export default ChangeCurrency;
