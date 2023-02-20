import { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'src/components/ChangeCurrency';
import { MainButton } from 'src/components/Theme/StyledComponents';
import ThemeColor from 'src/components/ThemeColor';
import { setSafeName } from 'src/redux/slices/safeNameSlice';
import { SettingsInput } from 'src/components/StyledComponents/settings';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { updateMultisigContractOnServer } from 'src/apiCalls/multisigContractsCalls';
import { updateMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useTheme } from 'styled-components';
import { ReactComponent as HeartIcon } from 'src/assets/img/heart.svg';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { NoteSpan, Span } from './settings-style';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';

function SafeSettings() {
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const currentContract = useSelector(currentMultisigContractSelector);
  const safeName = currentContract?.name;
  const [name, setName] = useState(safeName);
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const theme: any = useTheme();

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
      <Text sx={{ mb: 1, fontSize: '18px' }} fontWeight={600}>
        Your safe name:
      </Text>
      <Typography sx={{ mb: 2, color: theme.palette.text.primary }} fontSize={maxWidth600 ? '15px' : '14px'}>
        Here you can change the name of your Safe.
      </Typography>
      <NoteSpan mb={3}>
        <Span>Note: </Span>
        This name is only stored locally. (You&apos;re the only one who&apos;s
        seeing it)
      </NoteSpan>
      <Box>
        <SettingsInput
          label="Safe Name"
          variant="outlined"
          disabled={isInReadOnlyMode}
          onChange={changeSafeName}
          value={name}
          sx={{ width: 250 }}
        />
        <MainButton
          variant="outlined"
          sx={{ display: 'block', mt: 2, ml: maxWidth600 ? 'auto' : '0' }}
          onClick={saveUpdates}
        >
          Change Safe Name
        </MainButton>
      </Box>
      <Text sx={{ mb: 1, mt: 2, fontSize: '18px' }} fontWeight={600}>
        Default currency:
      </Text>

      <Typography sx={{ mb: 2, color: theme.palette.text.primary }} fontSize={maxWidth600 ? '15px' : '14px'}>
        Pick a default currency for your Safe.
      </Typography>
      <ChangeCurrency />
      <Text sx={{ mb: 1, mt: 2, fontSize: '18px' }} fontWeight={600}>
        Appearance:
      </Text>

      <Typography sx={{ mb: 2, color: theme.palette.text.primary }} fontSize={maxWidth600 ? '15px' : '14px'}>
        You can choose between a dark and a light theme.
      </Typography>
      <ThemeColor />

      <a
        {...{
          target: '_blank',
        }}
        className="d-flex align-items-center mt-3"
        href="https://validblocks.com/"
      >
        <Text>
          Made with <HeartIcon className="mx-1" /> by ValidBlocks.
        </Text>
      </a>
      <Typography
        sx={{
          mt: 0.25,
          fontSize: '12px',
          color: isDarkThemeEnabled ? '#F0F6FF8a' : '000',
        }}
        fontSize={maxWidth600 ? '15px' : '14px'}
      >
        xSafe v0.1
      </Typography>
    </Box>
  );
}

export default SafeSettings;
