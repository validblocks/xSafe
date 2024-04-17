import { Box } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isDarkThemeEnabledSelector,
  selectedThemeSelector,
} from 'src/redux/selectors/appConfigSelector';
import { setSelectedTheme } from 'src/redux/slices/appConfigSlice';
import * as Styled from 'src/components/Utils/styled';
import { StyledSelect } from 'src/components/MultisigDetails/styled';
import { Text } from '../../StyledComponents/StyledComponents';

function ThemeColor() {
  const dispatch = useDispatch();
  const theme = useSelector(selectedThemeSelector);
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const onChangeTheme = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>, newTheme: string | null) => {
      if (!newTheme) return;
      dispatch(setSelectedTheme(e.target.value as 'Light' | 'Dark'));
    },
    [dispatch],
  );

  return (
    <Box>
      <StyledSelect
        value={theme}
        label="Theme"
        sx={{ width: 250 }}
        MenuProps={{
          sx: {
            '&&&': {
              '& .MuiPaper-root > ul': {
                padding: '8px 0',
                backgroundColor: isDarkThemeEnabled ? '#1E1D2A' : '#fff',
              },
              '& .MuiPaper-root': {
                marginTop: '2px',
                backgroundColor: 'transparent',
              },
            },
          },
        }}
        onChange={onChangeTheme}
      >
        <Styled.ThemePrimaryMenuItem key="Dark" value="Dark">
          <Styled.ThemePrimaryBox
            display="flex"
            sx={{
              '& > img': {
                m: '5px 10px 0 0',
                flexShrink: 0,
                borderRadius: '2px',
              },
            }}
          >
            <Text>Dark</Text>
          </Styled.ThemePrimaryBox>
        </Styled.ThemePrimaryMenuItem>
        <Styled.ThemePrimaryMenuItem key="Light" value="Light">
          <Styled.ThemePrimaryBox
            display="flex"
            sx={{
              '& > img': {
                m: '5px 10px 0 0',
                flexShrink: 0,
                borderRadius: '2px',
              },
            }}
          >
            <Text>Light</Text>
          </Styled.ThemePrimaryBox>
        </Styled.ThemePrimaryMenuItem>
      </StyledSelect>
    </Box>
  );
}

export default ThemeColor;
