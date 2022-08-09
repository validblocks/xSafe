import { Box, Tab, Tabs } from '@mui/material';
import { TabPanel } from 'src/pages/Transactions/TransactionsPage';
import { useState } from 'react';

interface IPanel {
    title: string;
    content: React.ReactNode;
}

interface ContainerWithPanelProps {
    panels: IPanel[];
}

const ContainerWithPanels = ({ panels }: ContainerWithPanelProps) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box
      sx={{
        width: '100%',
        padding: '2rem',
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
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {
                panels.map((panel, index) =>
                  <Tab key={panel.title} label={panel.title} {...a11yProps(index)} />,
                )
            }
          </Tabs>
        </Box>
        {panels.map((panel, index) => (
          <TabPanel key={panel.title} value={selectedTab} index={index}>
            {panel.content}
          </TabPanel>
        ),
        )
        }

      </Box>
    </Box>
  );
};

export default ContainerWithPanels;
