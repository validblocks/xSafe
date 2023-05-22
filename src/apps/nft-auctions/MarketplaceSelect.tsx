import React from 'react';
import { Box, MenuItem, useTheme } from '@mui/material';
import '../../components/ChangeCurrency/ChangeCurrency.scss';
import { MainSelect } from 'src/components/Theme/StyledComponents';
import { makeStyles } from '@mui/styles';
import { NFTMarketplace } from './types';

type Props = {
  selectedMarketplace: NFTMarketplace;
  setSelectedMarketplace: React.Dispatch<React.SetStateAction<NFTMarketplace>>;
  marketplaces: NFTMarketplace[];
};

export const MarketplaceSelect = ({ marketplaces, selectedMarketplace, setSelectedMarketplace }: Props) => {
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
    setSelectedMarketplace(
      (prev) => marketplaces.find((marketplace) => marketplace.title === param?.target?.value) ?? prev);
  };
  return (
    <Box>
      <MainSelect
        id="demo-simple-select"
        value={selectedMarketplace.title}
        sx={{
          minWidth: '185px',
          // width: maxWidth600 ?? '100%',
        }}
        size="small"
        variant="standard"
        onChange={changeApp}
        MenuProps={{ className: styleProp.dropdown }}
      >
        {marketplaces.map(
          ({ title, icon }) => (
            <MenuItem key={title} value={title}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box mr={1}>{icon}</Box>
                <Box>{title}</Box>
              </Box>
            </MenuItem>
          ),
        )}
      </MainSelect>
    </Box>
  );
};

export default MarketplaceSelect;
