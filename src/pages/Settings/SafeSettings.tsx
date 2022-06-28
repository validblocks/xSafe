import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'components/ChangeCurrency';
import { MainButton, TypographyBold } from 'components/Theme/StyledComponents';
import ThemeColor from 'components/ThemeColor';
import { safeNameStoredSelector } from 'redux/selectors/safeNameSelector';
import { setSafeName } from 'redux/slices/safeNameSlice';
import { NoteSpan, Span } from './settings-style';

function SafeSettings() {
  const safeName = useSelector(safeNameStoredSelector);
  useEffect(() => {
    setName(safeName);
  }, [safeName]);
  const dispatch = useDispatch();

  const [name, setName] = React.useState('');

  const changeSafeName = (event: any) => {
    setName(event.target.value);
  };

  const saveUpdates = () => {
    dispatch(setSafeName(name));
  };

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
          <Span>Note:</Span>
          This name is only stored locally. (You&apos;re the only one who&apos;s
          seeing it)
        </NoteSpan>
      </Typography>
      <TextField
        id='outlined-basic'
        label='Safe Name'
        variant='outlined'
        onChange={changeSafeName}
        value={name}
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
      <Box className=' d-flex justify-content-end'>
        <MainButton
          variant='outlined'
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
