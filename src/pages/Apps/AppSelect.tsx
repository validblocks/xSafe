import React from 'react';
import { Box, MenuItem, useTheme } from '@mui/material';
import '../../components/ChangeCurrency/ChangeCurrency.scss';
import { MainSelect } from 'src/components/Theme/StyledComponents';
import { makeStyles } from '@mui/styles';
import { AppWithRouteConfig } from 'src/apps/apps';

type Props = {
  selectedApp: AppWithRouteConfig;
  setSelectedApp: React.Dispatch<React.SetStateAction<AppWithRouteConfig>>;
  apps: AppWithRouteConfig[];
};

export const AppSelect = ({ apps, selectedApp, setSelectedApp }: Props) => {
  const theme = useCustomTheme();

  const useStyles = makeStyles(() => ({
    dropdown: {
      '& .MuiPaper-root': {
        marginTop: '6px',
        width: '155px',
        backgroundColor: theme.palette.background.secondary,
        '& .MuiButtonBase-root': {
          color: theme.palette.text.primary,
        },
      },
      '@media (max-width:600px)': {
        '& .MuiPaper-root': {
          width: '100%',
        },
      },
    },
  }));

  const styleProp = useStyles();

  const changeApp = (param: any) => {
    setSelectedApp((oldApp) => apps.find((app) => app.name === param?.target?.value) ?? oldApp);
  };
  return (
    <Box>
      <MainSelect
        id="demo-simple-select"
        value={selectedApp.name}
        sx={{
          minWidth: '185px',
          // width: maxWidth600 ?? '100%',
        }}
        size="small"
        variant="standard"
        onChange={changeApp}
        MenuProps={{ className: styleProp.dropdown }}
      >
        {apps.map(
          ({ name, icon }) => (
            <MenuItem key={name} value={name}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box mr={1}>{icon}</Box>
                <Box>{name}</Box>
              </Box>
            </MenuItem>
          ),
        )}
      </MainSelect>
    </Box>
  );
};

export default AppSelect;
