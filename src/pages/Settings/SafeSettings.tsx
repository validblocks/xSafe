import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'src/components/ChangeCurrency';
import { MainButton, TypographyBold } from 'src/components/Theme/StyledComponents';
import ThemeColor from 'src/components/ThemeColor';
import { safeNameStoredSelector } from 'src/redux/selectors/safeNameSelector';
import { setSafeName } from 'src/redux/slices/safeNameSlice';
import { useTheme } from 'styled-components';
import { NoteSpan, Span } from './settings-style';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';

function SafeSettings() {
  const safeName = useSelector(safeNameStoredSelector);
  const [name, setName] = useState('');
  const { isInReadOnlyMode } = useOrganizationInfoContext();

  useEffect(() => {
    setName(safeName);
  }, [safeName]);
  const dispatch = useDispatch();

  const changeSafeName = (event: any) => {
    setName(event.target.value);
  };

  const saveUpdates = () => {
    dispatch(setSafeName(name));
  };

  const theme: any = useTheme();

  return (
    <Box>
      <TypographyBold sx={{ mb: 1, fontSize: '18px' }}>
        Your safe name:
      </TypographyBold>
      <Typography sx={{ mb: 2 }}>
        Here you can change the name of your Safe.
      </Typography>
      <Typography sx={{ mb: 3 }}>
        <NoteSpan>
          <Span>Note: </Span>
          This name is only stored locally. (You&apos;re the only one who&apos;s
          seeing it)
        </NoteSpan>
      </Typography>
      <TextField
        label="Safe Name"
        variant="outlined"
        disabled={isInReadOnlyMode}
        onChange={changeSafeName}
        value={name}
        inputProps={{
          sx: {
            border: `1px solid ${theme.palette.divider.main}`,
            borderRadius: '10px',
            outline: 'none',
            color: 'red !important',
          },
        }}
        sx={{ width: 250 }}
      />
      <TypographyBold sx={{ mb: 1, mt: 2, fontSize: '18px' }}>
        Default Currency
      </TypographyBold>

      <Typography sx={{ mb: 2 }}>
        Pick a default currency for your Safe.
      </Typography>
      <ChangeCurrency />
      <TypographyBold sx={{ mb: 1, mt: 2, fontSize: '18px' }}>
        Appearance
      </TypographyBold>

      <Typography sx={{ mb: 2 }}>
        You can choose between a dark and a light theme.
      </Typography>
      <ThemeColor />
      <Box className=" d-flex justify-content-end">
        <MainButton
          variant="outlined"
          sx={{ display: 'block', mt: 5 }}
          onClick={saveUpdates}
        >
          Save Updates
        </MainButton>
      </Box>
    </Box>
  );
}

export default SafeSettings;
