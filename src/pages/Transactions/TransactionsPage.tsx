import React, { useState } from 'react';
import { Box, MenuItem, SelectChangeEvent, Tab } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { MainSelect } from 'src/components/Theme/StyledComponents';
import { useTheme } from 'styled-components';
import {
  setIntervalEndTimestamp,
  setIntervalStartTimestamp,
  setIntervalStartTimestampForFiltering,
} from 'src/redux/slices/transactionsSlice';
import TransactionHistory from './TransactionHistory';
import {
  HistoryInterval,
  HISTORY_INTERVALS,
} from './TransactionHistoryIntervals';
import TransactionQueue from './TransactionQueue';
import * as Styled from '../../components/Utils/styled/index';

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: '0.35rem 0' }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TransactionsPage() {
  const theme: any = useTheme();
  const [value, setValue] = React.useState(0);

  const [intervalLabel, setIntervalLabel] = useState('Last day');

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  const handleChangeOnHistoryInterval = (event: SelectChangeEvent) => {
    const newLabelSelected = event.target.value;
    setIntervalLabel(newLabelSelected);

    const { intervalStartTimestamp: newIntervalStartTimestamp } =
      HISTORY_INTERVALS.find(
        (interval) => interval.label === newLabelSelected,
      ) ?? {};

    if (!newIntervalStartTimestamp) return;
    dispatch(setIntervalStartTimestamp(newIntervalStartTimestamp));
    dispatch(setIntervalEndTimestamp(new Date().getTime() / 1000));
    dispatch(setIntervalStartTimestampForFiltering(newIntervalStartTimestamp));
  };

  return (
    <Box width={'100%'}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Styled.MainTab
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="QUEUE" {...a11yProps(0)} sx={{ color: theme.palette.text.secondary }} />
            <Tab label="HISTORY" {...a11yProps(1)} sx={{ color: theme.palette.text.secondary }} />
          </Styled.MainTab>
          {value === 1 && (
            <Box>
              <MainSelect
                id="demo-simple-select"
                value={intervalLabel}
                sx={{ minWidth: '155px' }}
                size="small"
                variant="standard"
                onChange={handleChangeOnHistoryInterval as any}
              >
                {HISTORY_INTERVALS.map(
                  ({ intervalStartTimestamp, label }: HistoryInterval) => (
                    <MenuItem key={intervalStartTimestamp} value={label}>
                      {label}
                    </MenuItem>
                  ),
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
