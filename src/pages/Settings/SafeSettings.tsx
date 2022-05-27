import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'components/ChangeCurrency';
import ThemeColor from 'components/ThemeColor';
import { safeNameStoredSelector } from 'redux/selectors/safeNameSelector';
import { setSafeName } from 'redux/slices/safeNameSlice';

const SafeSettings = () => {
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
      <Typography sx={{ mb: 1, fontSize: '18px' }} className='bold-text'>
        Your safe name:
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Here you can change the name of your Safe.
      </Typography>
      <Typography sx={{ mb: 3 }} className='note-wrapper'>
        <span>
          <span className='bold-text'>Note:</span>This name is only stored
          locally. (You&apos;re the only one who&apos;s seeing it)
        </span>
      </Typography>
      <TextField
        id='outlined-basic'
        label='Safe Name'
        variant='outlined'
        onChange={changeSafeName}
        value={name}
        sx={{ width: 250 }}
      />
      <Typography sx={{ mb: 1, mt: 2, fontSize: '18px' }} className='bold-text'>
        Default Currency
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Pick a default currency for your Safe.
      </Typography>
      <ChangeCurrency />
      <Typography sx={{ mb: 1, mt: 2, fontSize: '18px' }} className='bold-text'>
        Appearance
      </Typography>

      <Typography sx={{ mb: 2 }}>
        You can choose between a dark and a light theme.
      </Typography>
      <ThemeColor />
      <Box className=' d-flex justify-content-end'>
        <Button
          className='new-transfer-btn'
          variant='outlined'
          sx={{ display: 'block', mt: 5 }}
          onClick={saveUpdates}
        >
          Save Updates
        </Button>
      </Box>
    </Box>
  );
};

export default SafeSettings;
