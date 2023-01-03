import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import menuItems, { availableApps, MenuItem, preinstalledApps } from 'src/utils/menuItems';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { useSelector } from 'react-redux';
import {
  MobileDropDownContainer,
  MobileMenuAccordion,
  MobileMenuAccordionSummary,
  MobileMenuAccordionSummaryContent,
  MobilePinnedIcon,
  MobileSubmenuAccordionSummary,
} from '../StyledComponents/StyledComponents';

const MobileMenuSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pinnedApps, _setPinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);
  const [installedApps, _setInstalledApps] = useLocalStorage(LOCAL_STORAGE_KEYS.INSTALLED_APPS, []);
  const _isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const menuRef = useRef<HTMLElement>();
  const buttonMenuRef = useRef<HTMLElement>();

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

  useEffect(() => setIsOpen(isOpen), [isOpen]);

  useEffect(() => {
    const handler = (e: any) => {
      if (!menuRef.current?.contains(e.target) && !buttonMenuRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [isOpen]);

  const dropDownMenu = () => (
    <MobileDropDownContainer ref={menuRef}>
      {
        menuItems.mobileDropDownItems.map((item) => (
          <Box key={item.id} sx={{ borderBottom: '1px solid #E0E0E0 !important' }}>
            <MobileMenuAccordion
              expanded={expanded === `${item.id}`}
              onChange={handleChange(`${item.id}`)}
              TransitionProps={{ unmountOnExit: true }}
              sx={{ borderBottom: '1px solid #E0E0E0' }}
            >
              <MobileMenuAccordionSummary id={item.id} aria-controls="panel1a-content">
                {item.name === 'Settings' ?
                  (
                    <Link to={item.link}>
                      <MobileMenuAccordionSummaryContent>
                        {item.icon}
                        <Typography>{item.name}</Typography>
                      </MobileMenuAccordionSummaryContent>
                    </Link>
                  ) : (
                    <MobileMenuAccordionSummaryContent>
                      {item.icon}
                      <Typography>{item.name}</Typography>
                    </MobileMenuAccordionSummaryContent>
                  )}
              </MobileMenuAccordionSummary>
              {item.submenu?.map((subItem: MenuItem) => (
                <Link to={subItem.link}>
                  <MobileSubmenuAccordionSummary key={subItem.id}>
                    {subItem.icon}
                    {subItem.name}
                  </MobileSubmenuAccordionSummary>
                </Link>
              ))}
              {item.name === 'Apps' && [
                ...availableApps
                  .filter((app: MenuItem) => installedApps.includes(app.id)),
              ].map((subItem: MenuItem) => (
                <Link to={subItem.link}>
                  <MobileSubmenuAccordionSummary key={subItem.id}>
                    {subItem.icon}
                    {subItem.name}
                  </MobileSubmenuAccordionSummary>
                </Link>
              ))}
            </MobileMenuAccordion>
          </Box>
        ))}
      <div>
        <MobileMenuAccordion
          disabled={installedAndPinnedApps.length < 1}
        >
          <MobileMenuAccordionSummary id="pinned-apps" aria-controls="panel1a-content">
            <MobileMenuAccordionSummaryContent>
              <MobilePinnedIcon />
              <Typography>Pinned apps</Typography>
            </MobileMenuAccordionSummaryContent>
          </MobileMenuAccordionSummary>
          {installedAndPinnedApps.map((app) => (
            <Link to={app.link}>
              <MobileSubmenuAccordionSummary>
                {app.icon}
                {app.name}
              </MobileSubmenuAccordionSummary>
            </Link>
          ))}
        </MobileMenuAccordion>
      </div>
    </MobileDropDownContainer>
  );

  return (
    <Box position={'relative'} ref={buttonMenuRef}>
      {/* <MobileMenuButton startIcon={<MobileMenuIcon />} onClick={handleClickDropDown} /> */}
      {isOpen && dropDownMenu()}
    </Box>
  );
};

export default MobileMenuSelect;
