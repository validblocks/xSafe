import React, { useState } from 'react';
import { Box, MenuItem, SelectChangeEvent, Tab } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { MainSelect } from 'src/components/Theme/StyledComponents';
import {
  intervalStartTimestampSelector,
} from 'src/redux/selectors/transactionsSelector';
import {
  enlargeInterval,
  setIntervalStartTimestampForFiltering,
} from 'src/redux/slices/transactionsSlice';
import { RootState } from 'src/redux/store';
import TransactionHistory from './TransactionHistory';
import {
  HistoryInterval,
  HISTORY_INTERVALS,
} from './TransactionHistoryIntervals';
import TransactionQueue from './TransactionQueue';
import * as Styled from './styled/index';

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
  const [value, setValue] = React.useState(0);
  const globalIntervalStartTimestamp = useSelector<RootState, number>(
    intervalStartTimestampSelector,
  );

  const [intervalLabel, setIntervalLabel] = useState(() => (
    HISTORY_INTERVALS.find(
      (interval) =>
        interval.intervalStartTimestamp === globalIntervalStartTimestamp,
    )?.label ?? 'Last day'
  ));

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
        (interval) => interval.label === newLabelSelected,
      ) ?? {};

    if (!newIntervalStartTimestamp) return;

    // current: last week ==> new: last month
    if (newIntervalStartTimestamp < oldIntervalStartTimestamp) {
      dispatch(enlargeInterval(newIntervalStartTimestamp));
    }

    // current: last month ==> new: last week
    if (newIntervalStartTimestamp > globalIntervalStartTimestamp) {
      dispatch(setIntervalStartTimestampForFiltering(newIntervalStartTimestamp));
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: '0 1rem',
      }}
    >
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
            <Tab label="queue" {...a11yProps(0)} />
            <Tab label="history" {...a11yProps(1)} />
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
