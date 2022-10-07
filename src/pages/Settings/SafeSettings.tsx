import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'src/components/ChangeCurrency';
import { MainButton, TypographyBold } from 'src/components/Theme/StyledComponents';
import ThemeColor from 'src/components/ThemeColor';
import { currentSafeNameSelector } from 'src/redux/selectors/safeNameSelector';
import { setSafeName } from 'src/redux/slices/safeNameSlice';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { NoteSpan, Span } from './settings-style';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';

function SafeSettings() {
  const safeName = useSelector(currentSafeNameSelector);
  const [name, setName] = useState(safeName);
  const { isInReadOnlyMode } = useOrganizationInfoContext();

  const currentContract = useSelector(currentMultisigContractSelector);

  useEffect(() => {
    setName(safeName);
  }, [safeName]);
  const dispatch = useDispatch();

  const changeSafeName = (event: any) => {
    setName(event.target.value);
  };

  const saveUpdates = () => {
    dispatch(setSafeName({
      address: currentContract?.address,
      newSafeName: name,
    }));
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
          <Span>Note: </Span>
          This name is only stored locally. (You&apos;re the only one who&apos;s
          seeing it)
        </NoteSpan>
      </Typography>
      <TextField
        id="outlined-basic"
        label="Safe Name"
        variant="outlined"
        disabled={isInReadOnlyMode}
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
        Appearance (Coming soon...)
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
