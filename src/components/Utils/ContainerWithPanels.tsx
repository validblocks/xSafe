import { Box, Tab, useMediaQuery } from '@mui/material';
import { TabPanel } from 'src/pages/Transactions/TransactionsPage';
import { useEffect, useState } from 'react';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import * as Styled from './styled';
import { GESTURE, GestureObserver } from 'src/utils/GestureObserver';

interface IPanel {
  title: string;
  content: React.ReactNode;
}

interface ContainerWithPanelProps {
  panels: IPanel[];
  initialTabIndex?: number;
  onTabChange?: (tab: number) => void;
}

const ContainerWithPanels = ({
  panels,
  initialTabIndex = 0,
  onTabChange,
}: ContainerWithPanelProps) => {
  const [selectedTab, setSelectedTab] = useState(initialTabIndex || 0);
  const theme = useCustomTheme();
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    console.log('newValue', newValue);
    onTabChange && onTabChange(newValue);
    setSelectedTab(newValue);
  };

  useEffect(() => {
    setSelectedTab(initialTabIndex);
  }, [initialTabIndex]);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    GestureObserver.subscribe(GESTURE.SWIPE_LEFT, () => {
      setSelectedTab((currentTab) => {
        if (currentTab < panels.length - 1) {
          onTabChange && onTabChange(currentTab + 1);
          return currentTab + 1;
        }
        return currentTab;
      });
    });

    GestureObserver.subscribe(GESTURE.SWIPE_RIGHT, () => {
      setSelectedTab((currentTab) => {
        if (currentTab === 0) return currentTab;
        onTabChange && onTabChange(currentTab - 1);
        return currentTab - 1;
      });
    });
  }, [onTabChange, panels.length, selectedTab]);

  return (
    <Styled.ContainerWithPanelsTopBox>
      <Styled.TabContainerBox>
        <Styled.MainTab value={selectedTab} onChange={handleChange}>
          {panels.map((panel, index) => (
            <Tab
              sx={{
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: '500',
                color: theme.palette.text.primary,
              }}
              key={panel.title}
              label={panel.title.toUpperCase()}
              {...a11yProps(index)}
            />
          ))}
        </Styled.MainTab>
      </Styled.TabContainerBox>
      <Box padding={maxWidth600 ? '60px 0 24px' : '12px 0 0'}>
        {panels.map((panel, index) => (
          <TabPanel key={panel.title} value={selectedTab} index={index}>
            {panel.content}
          </TabPanel>
        ))}
      </Box>
    </Styled.ContainerWithPanelsTopBox>
  );
};

export default ContainerWithPanels;
