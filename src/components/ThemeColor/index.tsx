import { Box, useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedThemeSelector } from 'src/redux/selectors/appConfigSelector';
import { setSelectedTheme } from 'src/redux/slices/appConfigSlice';
import * as Styled from 'src/components/Utils/styled';

function ThemeColor() {
  const dispatch = useDispatch();
  const themesList: string[] = ['Light', 'Dark'];
  const theme = useSelector(selectedThemeSelector);

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const onChangeTheme = useCallback((_event: any, newTheme: string | null) => {
    if (!newTheme) return;
    dispatch(setSelectedTheme(newTheme as 'Light' | 'Dark'));
  }, [dispatch]);

  return (
    <Box>
      <Styled.MultisigAutocomplete
        value={theme}
        disableClearable
        onChange={onChangeTheme as any}
        PopperComponent={Styled.MultisigPopper}
        id="themes-states-demo"
        options={themesList}
        sx={{ width: maxWidth600 ? '100%' : 250 }}
        renderInput={(params) => <TextField {...params} label="Theme" />}
      />
    </Box>
  );
}

export default ThemeColor;
