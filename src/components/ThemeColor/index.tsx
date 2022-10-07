import { Box } from '@mui/material';
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

  const onChangeTheme = useCallback((_event: any, newTheme: string | null) => {
    if (!newTheme) return;
    dispatch(setSelectedTheme(newTheme as 'Light' | 'Dark'));
  }, [dispatch]);

  return (
    <Box>
      <Styled.MultisigAutocomplete
        value={theme}
        onChange={onChangeTheme as any}
        id="themes-states-demo"
        options={themesList}
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label="Theme" />}
      />
    </Box>
  );
}

export default ThemeColor;
