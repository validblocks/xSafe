import React, { ReactNode, useState } from 'react';
import { Box, MenuItem, SelectChangeEvent, Tab, Tabs } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { MainSelect } from 'components/Theme/StyledComponents';
import TransactionHistory from './TransactionHistory';
import {
  HistoryInterval,
  HISTORY_INTERVALS
} from './TransactionHistoryIntervals';
import TransactionQueue from './TransactionQueue';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: '3rem 0' }}>
          <Typography component='span'>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TransactionsPage() {
  const [value, setValue] = React.useState(0);
  const [periodLabel, setIntervalLabel] = useState(HISTORY_INTERVALS[0].label);

  const { t } = useTranslation();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setValue(newValue);
  };

  const handleChangeOnHistoryInterval = (event: SelectChangeEvent) => {
    setIntervalLabel(event.target.value);
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: '2rem'
      }}
    >
      <h2 className='mb-3'>{t('Transactions')}</h2>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='basic tabs example'
          >
            <Tab label='QUEUE' {...a11yProps(0)} />
            <Tab label='HISTORY' {...a11yProps(1)} />
          </Tabs>
          {value === 1 && (
            <Box>
              <MainSelect
                id='demo-simple-select'
                value={periodLabel}
                sx={{ minWidth: '155px' }}
                size='small'
                variant='standard'
                onChange={handleChangeOnHistoryInterval as any}
              >
                {HISTORY_INTERVALS.map(
                  ({ afterTimestamp, label }: HistoryInterval) => (
                    <MenuItem key={afterTimestamp} value={label}>
                      {label}
                    </MenuItem>
                  )
                )}
              </MainSelect>
            </Box>
          )}
        </Box>
        <TabPanel value={value} index={0}>
          <TransactionQueue />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TransactionHistory />
        </TabPanel>
      </Box>
    </Box>
  );
};
