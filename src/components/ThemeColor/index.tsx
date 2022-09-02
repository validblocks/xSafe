import { Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedThemeSelector } from 'src/redux/selectors/appConfigSelector';
import { setSelectedTheme } from 'src/redux/slices/appConfigSlice';

function ThemeColor() {
  const themesList: string[] = ['Light', 'Dark'];
  const theme = useSelector(selectedThemeSelector);
  const dispatch = useDispatch();

  const onChangeTheme = useCallback((_event: any, newTheme: string | null) => {
    if (!newTheme) return;
    dispatch(setSelectedTheme(newTheme as 'Light' | 'Dark'));
  }, []);

  return (
    <Box>
      <Autocomplete
        disabled
        value={theme}
        onChange={onChangeTheme}
        id="themes-states-demo"
        options={themesList}
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label="Theme" />}
      />
    </Box>
  );
}

export default ThemeColor;
