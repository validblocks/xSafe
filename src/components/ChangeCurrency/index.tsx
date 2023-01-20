import { Box, SelectChangeEvent } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import './ChangeCurrency.scss';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import { SupportedCurrencies } from 'src/utils/supportedCurrencies';
import { setSelectedCurrency } from 'src/redux/slices/currencySlice';
import { StyledSelect } from 'src/pages/MultisigDetails/styled';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import * as Styled from '../Utils/styled';
import { Text } from '../StyledComponents/StyledComponents';

interface ICurrencySelectItem {
    code: string;
  label: string;
  description: string
    suggested?: boolean;
}

const currencyList: ICurrencySelectItem[] = [
  { code: 'US', label: 'USD', description: 'United States Dollar (USD)' },
  { code: 'EU', label: 'EUR', description: 'Euro (EUR)' },
  { code: 'RO', label: 'RON', description: 'Ron (RON)' },
];

function ChangeCurrency() {
  const globallySelectedCurrency = useSelector(selectedCurrencySelector);
  const dispatch = useDispatch();
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const changeCurrency = (param: SupportedCurrencies) => {
    dispatch(setSelectedCurrency(param));
  };
  return (
    <Box>
      <StyledSelect
        value={globallySelectedCurrency}
        // defaultValue={globallySelectedCurrency}
        label="Default Currency"
        sx={{ width: 250 }}
        MenuProps={{
          sx: {
            '&&&': {
              '& .MuiPaper-root > ul':
                {
                  padding: '8px 0',
                  backgroundColor: isDarkThemeEnabled ? '#1E1D2A' : '#fff',
                },
              '& .MuiPaper-root':
              {
                marginTop: '2px',
                backgroundColor: 'transparent',
              },
            },
          },
        }}
        onChange={(event: SelectChangeEvent) => changeCurrency(event.target.value as SupportedCurrencies)}
      >
        {currencyList.map((currency) => (
          <Styled.ThemePrimaryMenuItem key={currency.code} value={currency.label}>
            <Styled.ThemePrimaryBox
              display="flex"
              sx={{ '& > img': { m: '5px 10px 0 0', flexShrink: 0, borderRadius: '2px' } }}
            >
              <img
                loading="lazy"
                width="17"
                height="12"
                src={`https://flagcdn.com/w20/${currency.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${currency.code.toLowerCase()}.png 2x`}
                alt="flag"
              />
              <Text>
                {currency.description}
              </Text>
            </Styled.ThemePrimaryBox>
          </Styled.ThemePrimaryMenuItem>
        ))}
      </StyledSelect>
    </Box>
  );
}

export default ChangeCurrency;
