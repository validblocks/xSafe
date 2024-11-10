import { useCallback, useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'src/components/ChangeCurrency';
import { MainButton } from 'src/components/Theme/StyledComponents';
import ThemeColor from 'src/components/Theme/ThemeColor';
import { setSafeName } from 'src/redux/slices/safeNameSlice';
import { SettingsInput } from 'src/components/StyledComponents/settings';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { updateMultisigContractOnServer } from 'src/apiCalls/multisigContractsCalls';
import { updateMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import HeartIcon from 'src/assets/img/heart.svg';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { NoteSpan, Span } from './settings-style';
import BuildNumber from './BuildNumber';
import { MultisigContractInfoType } from 'src/types/multisig';

function SafeSettings() {
  const theme = useCustomTheme();
  const dispatch = useDispatch();
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const currentContract = useSelector(currentMultisigContractSelector);
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const safeName = currentContract?.name;
  const [name, setName] = useState(safeName);

  useEffect(() => {
    setName(safeName);
  }, [safeName]);

  const changeSafeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [],
  );

  const updateContractName = useCallback(
    (name: string) => {
      if (!currentContract || !currentContract.address) {
        console.debug('No safe selected! Could not update name.');
        return;
      }

      const newContract: MultisigContractInfoType = {
        ...currentContract,
        name,
      };

      if (!newContract.address) {
        console.debug('New contract has no address. Stopping save.');
        return;
      }

      updateMultisigContractOnServer(newContract);
      dispatch(updateMultisigContract(newContract));
    },
    [currentContract, dispatch],
  );

  const saveUpdates = useCallback(() => {
    if (!name) {
      console.debug('No name provided. Stopping save');
      return;
    }

    updateContractName(name);
    dispatch(
      setSafeName({
        address: currentContract?.address,
        newSafeName: name,
      }),
    );
  }, [dispatch, name, updateContractName, currentContract?.address]);

  return (
    <Box>
      <Text sx={{ mb: 1, fontSize: '18px' }} fontWeight={600}>
        Your safe name:
      </Text>
      <Typography
        sx={{ mb: 2, color: theme.palette.text.primary }}
        fontSize={maxWidth600 ? '15px' : '14px'}
      >
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

      <Typography
        sx={{ mb: 2, color: theme.palette.text.primary }}
        fontSize={maxWidth600 ? '15px' : '14px'}
      >
        Pick a default currency for your Safe.
      </Typography>
      <ChangeCurrency />
      <Text sx={{ mb: 1, mt: 2, fontSize: '18px' }} fontWeight={600}>
        Appearance:
      </Text>

      <Typography
        sx={{ mb: 2, color: theme.palette.text.primary }}
        fontSize={maxWidth600 ? '15px' : '14px'}
      >
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
          Made with <img src={HeartIcon} className="mx-1" /> by ValidBlocks.
        </Text>
      </a>
      <Typography
        sx={{
          fontSize: '12px',
          color: isDarkThemeEnabled ? '#F0F6FF8a' : '#000',
        }}
        fontSize={maxWidth600 ? '15px' : '14px'}
      >
        xSafe v0.1
      </Typography>
      <BuildNumber />
    </Box>
  );
}

export default SafeSettings;
