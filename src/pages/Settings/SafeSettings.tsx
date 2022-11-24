import { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'src/components/ChangeCurrency';
import { MainButton, TypographyBold } from 'src/components/Theme/StyledComponents';
import ThemeColor from 'src/components/ThemeColor';
import { setSafeName } from 'src/redux/slices/safeNameSlice';
import { SettingsInput } from 'src/components/StyledComponents/settings';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { updateMultisigContractOnServer } from 'src/apiCalls/multisigContractsCalls';
import { updateMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { NoteSpan, Span } from './settings-style';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';

function SafeSettings() {
  const { isInReadOnlyMode } = useOrganizationInfoContext();

  const currentContract = useSelector(currentMultisigContractSelector);
  const safeName = currentContract?.name;
  const [name, setName] = useState(safeName);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setName(safeName);
  }, [safeName]);
  const dispatch = useDispatch();

  const changeSafeName = (event: any) => {
    setName(event.target.value);
  };

  function handleUpdateContractName(name: string) {
    const newContract = {
      ...currentContract,
      name,
    };
    updateMultisigContractOnServer(newContract);
    dispatch(updateMultisigContract(newContract));
  }

  const saveUpdates = () => {
    handleUpdateContractName(name);
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
      <Typography sx={{ mb: 2 }} fontSize={maxWidth600 ? '15px' : '14px'}>
        Here you can change the name of your Safe.
      </Typography>
      <Typography sx={{ mb: 3 }}>
        <NoteSpan>
          <Span>Note: </Span>
          This name is only stored locally. (You&apos;re the only one who&apos;s
          seeing it)
        </NoteSpan>
      </Typography>
      <SettingsInput
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

      <Typography sx={{ mb: 2 }} fontSize={maxWidth600 ? '15px' : '14px'}>
        Pick a default currency for your Safe.
      </Typography>
      <ChangeCurrency />
      <TypographyBold sx={{ mb: 1, mt: 2, fontSize: '18px' }}>
        Appearance
      </TypographyBold>

      <Typography sx={{ mb: 2 }} fontSize={maxWidth600 ? '15px' : '14px'}>
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
