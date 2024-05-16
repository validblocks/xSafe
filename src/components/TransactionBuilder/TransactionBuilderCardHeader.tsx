import { Box, Stack, Typography } from '@mui/material';
import { AntSwitch } from './AntSwitch';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useCallback, useState } from 'react';
import { useCustomTheme } from 'src/hooks/useCustomTheme';

interface Props {
  handleSwitchChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  initialIsEnabled?: boolean;
}

export const TransactionBuilderCardHeader = ({
  handleSwitchChange,
  initialIsEnabled = false,
}: Props) => {
  const theme = useCustomTheme();
  const t = useCustomTranslation();

  const [isEnabled, setIsEnabled] = useState(initialIsEnabled);

  const handleChangeIsEnabled = useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      handleSwitchChange?.(e);
      setIsEnabled((isEnabled) => !isEnabled);
    },
    [handleSwitchChange],
  );

  return (
    <Box
      sx={{
        p: '1.75rem 2rem',
        borderBottom: `2px solid ${theme.palette.background.default}`,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center !important' }}>
        <Text
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {t('New Transaction')}
        </Text>
      </Box>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>{t('Custom Data')}</Typography>
          <AntSwitch
            onChange={handleChangeIsEnabled}
            value={isEnabled}
            inputProps={{ 'aria-label': 'ant design' }}
          />
          <Typography>{t('Use ABI')}</Typography>
        </Stack>
      </Box>
    </Box>
  );
};
