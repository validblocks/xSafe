import {
  Menu,
  Box,
  Button,
  ListItemButton,
  AccordionSummary,
  AccordionDetails,
  List,
  Grid,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Navbar as NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { ReactComponent as ElrondLogo } from 'src/assets/img/elrond.svg';
import CopyButton from 'src/components/CopyButton';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import MuiDrawer from '@mui/material/Drawer';
import pxToRem from 'src/components/Utils/pxToRem';

export const ConnectDropdown = styled(Menu)`
  top: 20px !important;
`;

export const ConnectItems = styled(Box)`
  background: ${(props) => props.theme.palette.background.main};
  color: ${(props) => props.theme.palette.primary.main};
  border-radius: ${(props) => props.theme.shape.radius};
`;
export const CopyBtn = styled(CopyButton)`
&&& {
  color: ${(props) => props.theme.palette.anchor.main};
}
`;

export const DisconnectButton = styled(Button)`
&&& {
  color: ${(props) => props.theme.palette.danger.main};
  border: 1px solid ${(props) => props.theme.palette.danger.main};
  padding: 10px 16px 8px;
  margin-top: 0px;
  top: 16px;
  border-radius: ${(props) => props.theme.shape.radius};
  background: ${(props) => props.theme.palette.background.danger};
  & > div {
    display: flex;
    align-items: center;
  };
  &:hover {
    color: ${(props) => props.theme.palette.background.white};
    background-color: ${(props) => props.theme.palette.danger.main};
    border-color: ${(props) => props.theme.palette.danger.main};
  };
}
`;

export const ReadOnly = styled(Text)`
&&& {
  border-radius: .4rem;
  background: rgba(8, 4, 29, 0.1);
  color: #7a7883;
  font-size: 14px;
  padding: 2px 9px;
}
`;

export const Anchor = styled.a`
  & svg {
    fill: ${(props) => props.theme.palette.anchor.secondary};
  }
  color: ${(props) => props.theme.palette.anchor.secondary};
  `;

export const AnchorPurple = styled.a(({ theme: _ }) => ({
  '& svg': {
    fill: _.palette.anchor.main,
  },
  color: _.palette.anchor.main,
}));

export const AnchorConnectedAccount = styled.a(({ theme: _ }) => ({
  '& svg': {
    fill: _.palette.anchor.connectedAccount,
  },
  color: _.palette.anchor.connectedAccount,
}));

export const MembersBox = styled(Box)`
&&& {
  width: 17px;
  margin: auto;
  background-color: ${(props) => props.theme.palette.background.safe};
  border-radius: 4px;
  margin-top: 10px;
  color: ${(props) => props.theme.palette.primary.main};
}
`;

export const SmallWarningBox = styled(MembersBox)`
  background-color: #ffececb1;
`;

export const CenteredText = styled(Text)`
  @media (max-width: 600px) {
    text-align: left;
  }
  text-align: center;
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  font-family: 'IBM Plex Sans', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
`;

export const TotalBalanceText = styled(CenteredText)(({ theme: _ }) => ({
  color: _.palette.text.totalBalance,
  fontSize: '16px',
  '@media (max-width:600px)': {
    fontSize: '15px',
  },
}));

export const TopHeader = styled(Box)`
&&& {
  background: ${(props) => props.theme.palette.background.secondary};
  width: 100%;
  height: 62px;
  position: fixed;
  top: 0;
  z-index: 999;
  box-shadow: ${(props) => props.theme.palette.shadows.primary};
}
`;

export const NavLogo = styled(NavItem)(({ theme: _ }) => ({
  cursor: 'pointer',
  width: '270px',
  '@media (max-width:600px)': {
    width: '100%',
    backgroundColor: _.palette.background.secondary,
  },
}));

export const Logo = styled(ElrondLogo)`
  width: 85px;
`;

export const DappName = styled.span`
  font-size: 19px;
  &:before {
    content: '';
    display: block;
    width: 1px;
    height: 30px;
    background-color: #9ba5b4;
    margin-right: 10px;
    margin-left: 10px;
  }
`;

export const TopMenu = styled(Box)(({ theme: _ }) => ({
  height: '100%',
  zIndex: 0,
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    width: '4px',
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: _.palette.background.scrollbar,
    borderRadius: '20px',
  },
  '& a.active svg > path': {
    color: '#4c2FFC !important',
  },
  '& a.active .MuiListItemButton-root': {
    backgroundColor: _.palette.background.menu,
  },
  '& a.active p': {
    color: `${_.palette.primary.main} !important`,
  },
}));

export const AppBarWrapper = styled(Box)(({ theme: _ }) => ({
  width: '100%',
  height: '62px',
  zIndex: '10000',
  '@media (max-width:600px)': {
    height: '0px',
  },
}));

export const SidebarAndMainWrapper = styled(Box)(({ theme: _ }) => ({
  height: 'calc(100vh - 62px)',
  display: 'flex',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    marginTop: '0',
  },
}));

const drawerWidth = 255;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme: _ }) => ({
  width: drawerWidth,
  flexShrink: 0,
  zIndex: 1,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

export const SidebarDrawer = styled(Drawer)(({ theme: _ }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: _.palette.background.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    heigth: '100%',
    overflowY: 'visible',
  },
}));

export const ListItem = styled(ListItemButton)`
&&& {
  background-color: ${(props) => props.theme.palette.background.secondary};
  transition: all 300ms linear;
  .pin-icon {
    opacity: 0;
    & path{
      fill: ${(props) => props.theme.palette.background.pinIcon};
    }
    transition: opacity 300ms linear;
  }
  & .MuiTypography-root, & .MuiListItemIcon-root {
    transition: all 300ms linear;
    color: ${(props) => props.theme.palette.text.menuItems};
  }
  & .MuiSvgIcon-root {
    color: ${(props) => props.theme.palette.svg.menuItems};
    transition: all 300ms linear;
  };
  &:hover {
    & .MuiSvgIcon-root {
      color: #4c2FFC !important;
    }
    background-color: ${(props) => props.theme.palette.background.hover};
    & .MuiTypography-root, & .MuiListItemIcon-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
  };
  &:hover .pin-icon {
    opacity: 1;
  };
}
`;

export const BreadcrumbsWrapper = styled(Box)`
  margin-left: 260px;
`;

export const MenuAccordion = styled(AccordionSummary)`
&&& {
  transition: all 300ms linear;
  background-color: ${(props) => props.theme.palette.background.secondary};
  & .MuiAccordionSummary-content {
    margin: 0px;
  };
  & .MuiAccordionSummary-expandIconWrapper,& .MuiTypography-root,& .MuiListItemIcon-root {
    transition: color 300ms linear;
  };
  & svg {
    color: ${(props) => props.theme.palette.text.menuItems};
  };
  &:hover {
    background-color: ${(props) => props.theme.palette.background.hover};
    .MuiListItemButton-root {
      background-color: ${(props) => props.theme.palette.background.hover};
    }
    .MuiSvgIcon-root {
      color: #4c2FFC !important;
    }
    .MuiTypography-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
    .MuiAccordionSummary-expandIconWrapper {
      color: rgba(76, 47, 252, 0.54);
    };
  };
  &.Mui-expanded {
    min-height: 48px;
    background-color: ${(props) => props.theme.palette.background.menu};
    .MuiTypography-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
    .MuiListItemIcon-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
    & .MuiSvgIcon-root {
      color: #4c2FFC !important;
      transition: color 300ms linear;
    }
    & .MuiTypography-root {
      color: ${(props) => props.theme.palette.primary.main};
      transition: color 300ms linear;
    };
    .MuiAccordionSummary-expandIconWrapper {
      color: rgba(76, 47, 252, 0.54);
    };
    .MuiListItemButton-root {
      background-color:${(props) => props.theme.palette.background.menu}
    };
  };
}
`;

export const AccordionDetail = styled(AccordionDetails)`
  .link-hover {
    padding-left: 43px;
  }
`;

export const BottomMenuList = styled(List)(({ theme: _ }) => ({
  bottom: '10px',
  width: '100%',
  zIndex: '9',
  borderTop: `1px solid ${(props) => props.theme.palette.divider.main}`,

  '& a.active .MuiListItemButton-root': {
    backgroundColor: `${_.palette.background.menu}`,
  },
}));

export const PinnedIconBox = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    '.MuiButtonBase-root': {
      padding: '4px 8px 3px',
    },
    '.MuiSvgIcon-root': {
      transform: 'rotate(25deg)',
      '> path': {
        fill: _.palette.background.pinIcon,
      },
    },
  },
}));

// Mobile Layout

export const MobileMenu = styled(Box)(({ theme: _ }) => ({
  '&&&': {
    width: '100%',
    height: '93px',
    padding: '0 8px',
    zIndex: '1301 !important',
    display: 'flex',
    flexDirection: 'row',
    borderTopRightRadius: _.shape.radius,
    borderTopLeftRadius: _.shape.radius,
    boxShadow: _.palette.shadows.bottomNavbar,
    backgroundColor: _.palette.background.secondary,
    position: 'fixed',
    bottom: 0,
    '& a.active span': {
      color: `${_.palette.primary.main} !important`,
    },
  },
}));

export const TopMobileMenu = styled(Grid)(({ theme: _ }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  width: '100% !important',
  padding: '0 16px',
  zIndex: '1301px !important',
  backgroundColor: _.palette.background.secondary,
  '& span': {
    color: _.palette.text.primary,
    '& > p': {
      color: _.palette.text.readOnly,
    },
  },
}));

export const TopMobileMenuLogoBox = styled(Box)(({ theme: _ }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRight: '1px solid #9393931a',
  paddingRight: '16px',
}));

export const TopMobileMenuSafeBox = styled(Box)(({ theme: _ }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',

}));

export const TopMobileMenuActionBox = styled(Box)(({ theme: _ }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  borderLeft: '1px solid #9393931a',
  paddingLeft: '16px',
}));

export const BottomMenuButton = styled(Button)(({ theme: _ }) => ({
  '&&&': {
    color: `${_.palette.text.menuItems} !important`,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize',
    fontSize: pxToRem(14),
    height: '100%',
    width: '100%',
  },
}));

export const ArrowDropUp = styled(ArrowDropUpIcon)(({ theme: _ }) => ({
  fill: _.palette.background.safeOptions.svg,
}));
export const ArrowDropDown = styled(ArrowDropDownIcon)(({ theme: _ }) => ({
  fill: _.palette.background.safeOptions.svg,
}));

export const MobileSecondaryMenu = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
`;

export const TotalBalanceWrapper = styled(Box)`
  /* margin-top: 68px; */
  z-index: 1000;
  width: 100%;
  background-color: ${(props) => props.theme.palette.background.secondary};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  & > div {
    padding: 0px;
    border-top: solid 1px ${(props) => props.theme.palette.divider.sidebar};
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

export const LogoMenuWrapper = styled(Box)`
  position: fixed;
  background-color: ${(props) => props.theme.palette.background.white};
  z-index: 3;
  width: 100% !important;
`;
