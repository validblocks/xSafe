import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import './ChangeCurrency.scss';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import { SupportedCurrencies } from 'src/utils/supportedCurrencies';
import { setSelectedCurrency } from 'src/redux/slices/currencySlice';

interface ICurrencySelectItem {
    code: string;
    label: string;
    suggested?: boolean;
}

const currencyList: ICurrencySelectItem[] = [
  { code: 'US', label: 'USD' },
  { code: 'EU', label: 'EUR' },
  { code: 'RO', label: 'RON' },
];

function ChangeCurrency() {
  const getCurrency = useSelector(selectedCurrencySelector);
  const dispatch = useDispatch();

  const changeCurrency = (param: SupportedCurrencies) => {
    dispatch(setSelectedCurrency(param));
  };
  return (
    <Box>
      <Box>
        <Autocomplete
          onInputChange={(event, newInputValue) => {
            changeCurrency(newInputValue as SupportedCurrencies);
          }}
          value={{ code: '', label: `${getCurrency}` }}
          id="country-select-demo"
          sx={{ width: 250 }}
          options={currencyList}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                alt=""
              />
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <div>
              <SearchIcon className="search-icon" />
              <TextField
                {...params}
                className="currency-input"
                label="Search..."
              />
            </div>
          )}
        />
      </Box>
    </Box>
  );
}

export default ChangeCurrency;
