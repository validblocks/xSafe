import { Box, Tab } from '@mui/material';
import { TabPanel } from 'src/pages/Transactions/TransactionsPage';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import * as Styled from './styled';

interface IPanel {
    title: string;
    content: React.ReactNode;
}

interface ContainerWithPanelProps {
    panels: IPanel[];
}

const ContainerWithPanels = ({ panels }: ContainerWithPanelProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme: any = useTheme();

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
    <Styled.ContainerWithPanelsTopBox>
      <Box>
        <Styled.TabContainerBox>
          <Styled.MainTab
            value={selectedTab}
            onChange={handleChange}
          >
            {panels.map((panel, index) => (
              <Tab
                sx={{ paddingX: '2rem', textTransform: 'none', fontSize: '15px', fontWeight: '500', color: theme.palette.text.primary }}
                key={panel.title}
                label={panel.title}
                {...a11yProps(index)}
              />
            ))
            }
          </Styled.MainTab>
        </Styled.TabContainerBox>
        <Box paddingTop={'12px'}>
          {panels.map((panel, index) => (
            <TabPanel key={panel.title} value={selectedTab} index={index}>
              {panel.content}
            </TabPanel>
          ),
          )
        }
        </Box>
      </Box>
    </Styled.ContainerWithPanelsTopBox>
  );
};

export default ContainerWithPanels;
