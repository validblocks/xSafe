import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { ReactComponent as IconLedger } from 'src/assets/img/ledger.svg';
import { ReactComponent as IconElrond } from 'src/assets/img/elrond-web-wallet.svg';
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

export const PerformActionButton = styled(Button)(({ theme: _, disabled }) => ({
  '&&&': {
    width: _.width,

    height: _.height,
    backgroundColor: disabled ? '#D6CFFF1A' : _.palette.background.main,
    boxShadow: `0px 0px 8px ${_.shadows.main}`,
    color: disabled ? '#8680A9' : _.palette.primary.main,
    border: `1px solid ${disabled ? '#D6CFFF1A' : _.palette.secondary.main}`,
    padding: '7px 14px 6px',
    fontSize: '14px',
    textTransform: 'capitalize',
    fontWeight: _.font.weight.lg,
    '&:hover': {
      backgroundColor: _.palette.background.button,
      borderColor: _.palette.background.button,
      color: _.palette.background.white,
    },
  },
}));

export const DiscardActionButton = styled(Button)(({ theme: _, disabled }) => ({
  '&&&': {
    width: _.width,
    height: _.height,
    background: disabled ? '#D6CFFF1A' : _.palette.background.danger,
    color: disabled ? '#8680A9' : _.palette.text.discardButton,
    padding: '7px 14px 5px',
    border: `1px solid ${disabled ? '#D6CFFF1A' : _.palette.danger.main}`,
    textTransform: 'capitalize',
    fontWeight: _.font.weight.lg,
    '&:hover': {
      background: _.palette.danger.main,
      boxShadow: `0px 0px 8px ${_.shadows.main}`,
      color: '#F0F6FF',
    },
  },
}));

export const MultisigCard = styled(Box)`
  width: 240px;
  min-width: 240px;
  padding: 15px;
  background: ${(props) => props.theme.palette.background.secondary};
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03);
  border: none;
  @media (max-width: 600px){
    width: 100%;
  }
  @media (min-width: 601px) and (max-width: 1038px) {
    width: 100%;
  }
`;

export const MultisigCardGrid = styled(Grid)`
  @media (min-width: 787px) and (max-width: 1038px){
    width: 48.8%;
  }
  @media (max-width: 787px){
    width: 100%;
  }
  @media (min-width: 520px) and (max-width: 600px){
    width: 48.62%;
  }
`;

export const Text = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-family: 'IBM Plex Sans', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace !important;
    letter-spacing: -0.5px !important;
`;

export const TextxSafeDescription = styled(Text)(({ theme: _ }) => ({
  '&&&': {
    color: _.palette.text.xSafeDescription,
    maxWidth: '398px',
    fontSize: '19px',
    '@media (max-width:600px)': {
      fontSize: '16px',
    },
  },
}));

export const CardTitle = styled(Text)(({ theme: _ }) => ({
  color: _.palette.text.cardsTitle,
}));

export const UnlockText = styled(Text)(({ theme: _ }) => ({
  '&&&': {
    color: _.palette.text.primary,
    fontWeight: 600,
    marginBottom: 0,
  },
}));

export const StyledIconLedger = styled(IconLedger)(({ theme: _ }) => ({
  '& path': {
    fill: _.palette.text.primary,
  },
}));

export const StyledIconElrond = styled(IconElrond)(({ theme: _ }) => ({
  '& path': {
    fill: _.palette.text.primary,
  },
  '& path ~ path': {
    fill: _.palette.background.secondary,
  },
}));

export const TotalBalanceText = styled(Text)(({ theme: _ }) => ({
  color: _.palette.text.tableHeaders,
}));

export const MobileSettingsIcon = styled(SettingsIcon)(({ theme: _ }) => ({
  width: '26px',
  height: '26px',
  fill: `${_.palette.text.primary} !important`,
}));

export const MobileMenuIcon = styled(MenuRoundedIcon)(({ theme: _ }) => ({
  width: '26px',
  height: '26px',
  fill: `${_.palette.text.primary} !important`,
}));

export const MobileMenuCloseIcon = styled(CloseRoundedIcon)(({ theme: _ }) => ({
  width: '26px',
  height: '26px',
  fill: `${_.palette.text.primary} !important`,
}));

export const MobileMenuButton = styled(IconButton)`
  min-width: 0;
  padding: 0;
  color: ${({ theme }) => theme.palette.text.primary};
  & svg: {
    fill: ${({ theme }) => theme.palette.text.primary} !important;
  };
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
  alignItems: 'center',
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
