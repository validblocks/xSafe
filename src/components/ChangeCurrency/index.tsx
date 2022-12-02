import { Box } from '@mui/material';
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
    suggested?: boolean;
}

const currencyList: ICurrencySelectItem[] = [
  { code: 'US', label: 'USD' },
  { code: 'EU', label: 'EUR' },
  { code: 'RO', label: 'RON' },
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
      {/* <Select
          onChange={(e) => {
            changeCurrency(e.target.value as SupportedCurrencies);
          }}
          value={{ code: '', label: `${globallySelectedCurrency}` }}
          id="country-select-demo"
          sx={{ width: 250 }}
          // PopperComponent={Styled.MultisigPopper}
          autoHighlight
          getOptionLabel={(option: any) => option.label}
          renderOption={(props, option: any) => (
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
                alt="flag"
              />
              <Text>
                {option.label}
              </Text>
            </Box>
          )}
        /> */}
      <StyledSelect
        value={globallySelectedCurrency}
        defaultValue={globallySelectedCurrency}
        label={'Change Currency'}
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
        onChange={(e: any) => changeCurrency(e.target.value as SupportedCurrencies)}
      >
        {currencyList.map((currency) => (
          <Styled.ThemePrimaryMenuItem>
            <Styled.ThemePrimaryBox
              display="flex"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            >
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/${currency.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${currency.code.toLowerCase()}.png 2x`}
                alt="flag"
              />
              <Text>
                {currency.label}
              </Text>
            </Styled.ThemePrimaryBox>
          </Styled.ThemePrimaryMenuItem>
        ))}
      </StyledSelect>
    </Box>
  );
}

export default ChangeCurrency;
