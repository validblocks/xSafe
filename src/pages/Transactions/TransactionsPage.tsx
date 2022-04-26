import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Tab, Tabs } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { queryAllActions } from 'contracts/MultisigContract';
import TransactionHistory from './TransactionHistory';
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
        <Box sx={{ p: 3 }}>
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
  const [allActions, setAllActions] = React.useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchActions = async () => {
      const response = await queryAllActions();
      console.log({ response });
    };

    fetchActions();
  }, []);
  return (
    <Box
      sx={{
        padding: '8rem 1rem',
        backgroundColor: '#F6F7F8'
      }}
    >
      <h2 className='mb-5'>Transactions</h2>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          <Tab label='QUEUE' {...a11yProps(0)} />
          <Tab label='TRANSACTIONS' {...a11yProps(1)} />
        </Tabs>
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
