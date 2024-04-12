import React, { useEffect, useState } from 'react';
import {
  Box,
  MenuItem,
  SelectChangeEvent,
  Tab,
  useMediaQuery,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { MainSelect } from 'src/components/Theme/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import {
  setIntervalEndTimestamp,
  setIntervalStartTimestamp,
  setIntervalStartTimestampForFiltering,
} from 'src/redux/slices/transactionsSlice';
import makeStyles from '@mui/styles/makeStyles/makeStyles';
import TransactionHistory from './TransactionHistory';
import {
  HistoryInterval,
  HISTORY_INTERVALS,
} from '../../components/Transactions/TransactionHistoryIntervals';
import TransactionQueue from './TransactionQueue';
import * as Styled from '../../components/Utils/styled/index';
import { GESTURE, GestureObserver } from 'src/utils/GestureObserver';

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
  const [value, setValue] = React.useState(0);
  const styleProp = useStyles();

  const [intervalLabel, setIntervalLabel] = useState('Last day');

  const maxWidth600 = useMediaQuery('(max-width:600px)');

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

  useEffect(() => {
    GestureObserver.subscribe(GESTURE.SWIPE_LEFT, () => {
      setValue((currentTab) => {
        if (currentTab < 1) return currentTab + 1;
        return currentTab;
      });
    });

    GestureObserver.subscribe(GESTURE.SWIPE_RIGHT, () => {
      setValue((currentTab) => {
        if (currentTab > 0) return currentTab - 1;
        return currentTab;
      });
    });
  }, []);

  return (
    <Box width={'100%'}>
      <Box>
        <Box
          display={'flex'}
          width={'100%'}
          justifyContent={'space-between'}
          alignItems={'center'}
          flexDirection={maxWidth600 ? 'column' : 'row'}
          borderBottom={
            maxWidth600 ? 'none' : `2px solid ${theme.palette.divider.tabs}`
          }
        >
          <Styled.TransactionsTab
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="QUEUE" {...a11yProps(0)} />
            <Tab label="HISTORY" {...a11yProps(1)} />
          </Styled.TransactionsTab>
          {value === 1 && (
            <Box
              width={maxWidth600 ? '100%' : 'auto'}
              marginTop={maxWidth600 ? '50px' : 0}
            >
              <MainSelect
                id="demo-simple-select"
                value={intervalLabel}
                sx={{
                  minWidth: '155px',
                  width: maxWidth600 ?? '100%',
                }}
                size="small"
                variant="standard"
                onChange={handleChangeOnHistoryInterval as any}
                MenuProps={{ className: styleProp.dropdown }}
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
