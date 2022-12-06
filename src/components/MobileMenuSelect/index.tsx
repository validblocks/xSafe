import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import menuItems, { availableApps, MenuItem, preinstalledApps } from 'src/utils/menuItems';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { MobileDropDownContainer, MobileMenuButton, MobileMenuIcon } from '../StyledComponents/StyledComponents';

const MobileMenuSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pinnedApps, _setPinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);
  const [installedApps, _setInstalledApps] = useLocalStorage(LOCAL_STORAGE_KEYS.INSTALLED_APPS, []);

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const installedAndPinnedApps = useMemo(() => ([
    ...preinstalledApps,
    ...availableApps
      .filter((app: MenuItem) => installedApps.includes(app.id)),
  ].filter((app: MenuItem) => pinnedApps.includes(app.id))), [installedApps, pinnedApps]);

  const handleClickDropDown = () => setIsOpen(!isOpen);

  useEffect(() => setIsOpen(isOpen), [isOpen]);

  console.log(isOpen);

  const dropDownMenu = () => (
    <MobileDropDownContainer>
      {
        menuItems.mobileDropDownItems.map((item) => (
          <div key={item.id}>
            <Accordion
              expanded={expanded === `${item.id}`}
              onChange={handleChange(`${item.id}`)}
              sx={{ backgroundColor: 'black', color: 'white' }}
            >
              <AccordionSummary id={item.id} aria-controls="panel1a-content">
                {item.name === 'Settings' ?
                  <Link to={item.link}>{item.name}</Link> : <Typography>{item.name}</Typography>}
              </AccordionSummary>
              {item.submenu?.map((subItem: MenuItem) => (
                <AccordionDetails key={subItem.id}>
                  <Link to={subItem.link}>{subItem.name}</Link>
                </AccordionDetails>
              ))}
              {item.name === 'Apps' && [
                ...availableApps
                  .filter((app: MenuItem) => installedApps.includes(app.id)),
              ].map((subItem: MenuItem) => (
                <AccordionDetails key={subItem.id}>
                  <Link to={subItem.link}>{subItem.name}</Link>
                </AccordionDetails>
              ))}
            </Accordion>
          </div>
        ))}
      <div>
        <Accordion
          // expanded={expanded === `${app.id}`}
          // onChange={handleChange(`${app.id}`)}
          sx={{ backgroundColor: 'black', color: 'white' }}
        >
          <AccordionSummary id="pinned-apps" aria-controls="panel1a-content">
            <Typography>Pinned apps</Typography>
          </AccordionSummary>
          {installedAndPinnedApps.map((app) => (
            <AccordionDetails>
              <Link to={app.link}>{app.name}</Link>
            </AccordionDetails>
          ))}
        </Accordion>
      </div>
    </MobileDropDownContainer>
  );

  return (
    <Box position={'relative'}>
      <MobileMenuButton startIcon={<MobileMenuIcon />} onClick={handleClickDropDown} />
      {isOpen && dropDownMenu()}
    </Box>
  );
};

export default MobileMenuSelect;
