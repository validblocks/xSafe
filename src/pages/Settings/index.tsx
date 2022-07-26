import { Box } from '@mui/material';
import SafeSettings from './SafeSettings';
import { SettingsWrapper } from './settings-style';
import './settings.scss';

function Settings() {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <SettingsWrapper sx={{ p: 3 }}>
        <SafeSettings />
      </SettingsWrapper>
    </Box>
  );
}

export default Settings;
