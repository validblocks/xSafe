import React from 'react';
import { Box } from '@mui/material';
import SafeSettings from './SafeSettings';
import { SettingsWrapper } from './settings-style';

const Settings = () => (
  <Box>
    <SettingsWrapper sx={{ p: 3 }}>
      <SafeSettings />
    </SettingsWrapper>
  </Box>
);

export default Settings;
