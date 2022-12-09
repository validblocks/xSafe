import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import styled from 'styled-components';

export const MainButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.palette.text.primary}
`;

export const PerformActionButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.theme.palette.background.main};
  box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main};
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.secondary.main} !important;
  padding: 10px;
  font-size: 14px;
  text-transform: none;
  &:hover {
    background-color: ${(props) => props.theme.palette.background.button};
    border-color: ${(props) => props.theme.palette.background.button};
    color: ${(props) => props.theme.palette.background.white};
  }
`;

export const DiscardActionButton = styled(Button)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background: transparent !important;
  color: ${(props) => props.theme.palette.danger.main} !important;
  padding: 0.5rem 1rem !important;
  border: 1px solid ${(props) => props.theme.palette.danger.main} !important;
  &:hover {
    background: ${(props) => props.theme.palette.background.danger} !important;
    border: 1px solid ${(props) => props.theme.palette.danger.main} !important;
    box-shadow: 0px 0px 8px ${(props) => props.theme.shadows.main} !important;
  }
`;

export const MultisigCard = styled(Box)`
  width: 240px;
  padding: 15px;
  margin: 0 12px 12px 0;
  background: ${(props) => props.theme.palette.background.secondary};
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03);
  border: none;
  @media (max-width: 600px){
    width: 100%;
    margin-bottom: 16px;
  }
  @media (min-width: 601px) and (max-width: 800px) {
    width: 100%;
    margin: 0 0 12px 0;
  }
`;

export const MultisigCardGrid = styled(Grid)`
  @media (max-width: 519px){
    width: 100%;
  }
  @media (min-width: 520px) and (max-width: 600px){
    width: 48.5%;
  }
`;

export const Text = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-family: 'IBM Plex Sans', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace !important;
`;

export const TotalBalanceText = styled(Text)(({ theme: _ }) => ({
  color: _.palette.text.tableHeaders,
}));

export const MobileSettingsIcon = styled(SettingsIcon)(({ theme: _ }) => ({
  width: '26px',
  height: '26px',
  fill: _.palette.text.menuItems,
}));

export const MobileMenuIcon = styled(MenuRoundedIcon)(({ theme: _ }) => ({
  width: '26px',
  height: '26px',
  fill: _.palette.text.menuItems,
}));

export const MobileMenuButton = styled(Button)`
  min-width: 0;
  padding: 0;
  & .MuiButton-startIcon {
    margin: 0;
  }
`;

export const MobileDropDownContainer = styled(Box)(({ theme: _ }) => ({
  position: 'absolute',
  width: '100vw',
  top: '104px',
  right: 'calc(100% - 35px)',
  zIndex: 3,
  backgroundColor: _.palette.background.secondary,
  borderRadius: '10px',
  boxShadow: _.palette.shadows.dropDownMenu,
}));

export const MobileMenuAccordion = styled(Accordion)(({ theme: _ }) => ({
  '&&&': {
    color: _.palette.text.menuItems,
    backgroundColor: 'transparent',
    borderRadius: '0',
    boxShadow: 'none',
    '.Mui-disabled': {
      backgroundColor: _.palette.background.disabled,
    },
    '& .MuiCollapse-root a': {
      color: _.palette.primary.main,
      textDecoration: 'none',
    },
  },
}));

export const MobileMenuAccordionSummary = styled(AccordionSummary)(({ theme: _ }) => ({
  transition: 'all 300ms linear',
  margin: '0',
  '& .MuiAccordionSummary-content': {
    margin: '0',
    transition: 'color 300ms linear',
    '& svg': {
      transition: 'fill 300ms linear',
    },
  },
  '&.Mui-expanded': {
    minHeight: '48px',
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: '0',
      color: _.palette.primary.main,
      '& svg': {
        fill: '#4c2FFC',
      },
      '& a': {
        color: _.palette.primary.main,
      },
    },
  },
  '& a': {
    width: '100%',
    height: '48px',
    display: 'flex',
    alignContent: 'center',
    flexWrap: 'wrap',
    color: _.palette.text.menuItems,
    textDecoration: 'none',
  },
  '& p': {
    marginLeft: '8px',
  },
}));

export const MobileMenuAccordionSummaryContent = styled(Box)(({ theme: _ }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  '& p': {
    marginLeft: '8px',
  },
  '& a': {
    width: '100%',
  },
}));

export const MobileSubmenuAccordionSummary = styled(AccordionDetails)(({ theme: _ }) => ({
  padding: '0',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  borderTop: `solid 1px ${_.palette.divider.secondary}`,
  '& svg': {
    fill: 'currentcolor',
    margin: '0 8px 0 40px',
  },
}));

export const MobilePinnedIcon = styled(PushPinRoundedIcon)(({ theme: _ }) => ({
  transform: 'rotate(25deg)',
}));

export const ModalCardTitleContainer = styled(Box)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider.secondary};
  background-color: ${(props) => props.theme.palette.background.secondary};
  border-radius: 10px 10px 0 0;
  padding: 24px 48px;
  & .MuiButtonBase-root {
    &:hover {
      background-color: ${(props) => props.theme.palette.hover.secondary};
    },
  }
  @media (max-width: 600px){
    padding: 16px;
  }
`;
