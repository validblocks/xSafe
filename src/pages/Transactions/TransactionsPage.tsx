import React, { useState } from 'react';
import { Box, MenuItem, SelectChangeEvent, Tab, Tabs } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { MainSelect } from 'components/Theme/StyledComponents';
import {
  intervalEndTimestampSelector,
  intervalStartTimestampSelector
} from 'redux/selectors/transactionsSelector';
import {
  enlargeInterval,
  dwindleInterval
} from 'redux/slices/transactionsSlice';
import TransactionHistory from './TransactionHistory';
import {
  HistoryInterval,
  HISTORY_INTERVALS
} from './TransactionHistoryIntervals';
import TransactionQueue from './TransactionQueue';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: '0.35rem 0' }}>
          <Typography component='span'>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function TransactionsPage() {
  const [value, setValue] = React.useState(0);
  const globalIntervalStartTimestamp = useSelector(
    intervalStartTimestampSelector
  );

  const [intervalLabel, setIntervalLabel] = useState(() => {
    return (
      HISTORY_INTERVALS.find(
        (interval) =>
          interval.intervalStartTimestamp === globalIntervalStartTimestamp
      )?.label ?? 'HAHA'
    );
  });

  const { t } = useTranslation();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  const handleChangeOnHistoryInterval = (event: SelectChangeEvent) => {
    const newLabelSelected = event.target.value;
    setIntervalLabel(newLabelSelected);

    const { intervalStartTimestamp: oldIntervalStartTimestamp } =
      HISTORY_INTERVALS.find((interval) => interval.label === intervalLabel) ??
      {};

    if (!oldIntervalStartTimestamp) return;

    const { intervalStartTimestamp: newIntervalStartTimestamp } =
      HISTORY_INTERVALS.find(
        (interval) => interval.label === newLabelSelected
      ) ?? {};

    if (!newIntervalStartTimestamp) return;

    //current: last week ==> new: last month
    if (newIntervalStartTimestamp < oldIntervalStartTimestamp) {
      dispatch(enlargeInterval(newIntervalStartTimestamp));
    }

    //current: last month ==> new: last week
    if (newIntervalStartTimestamp > oldIntervalStartTimestamp) {
      dispatch(dwindleInterval(newIntervalStartTimestamp));
    }
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
                value={intervalLabel}
                sx={{ minWidth: '155px' }}
                size='small'
                variant='standard'
                onChange={handleChangeOnHistoryInterval as any}
              >
                {HISTORY_INTERVALS.map(
                  ({ intervalStartTimestamp, label }: HistoryInterval) => (
                    <MenuItem key={intervalStartTimestamp} value={label}>
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
}
