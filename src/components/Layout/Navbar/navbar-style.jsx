import {
  Menu,
  Box,
  Button,
  ListItemButton,
  AccordionSummary,
  AccordionDetails,
  List,
} from '@mui/material';
import { Navbar as NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { ReactComponent as ElrondLogo } from 'src/assets/img/elrond.svg';
import CopyButton from 'src/components/CopyButton';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import MuiDrawer from '@mui/material/Drawer';

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

export const NavLogo = styled(NavItem)`
  cursor: pointer;
  width: 270px;
`;

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
}));

export const AppBarWrapper = styled(Box)(({ theme: _ }) => ({
  width: '100%',
  height: '62px',
  zIndex: '10000',
}));

export const SidebarAndMainWrapper = styled(Box)(({ theme: _ }) => ({
  height: 'calc(100vh - 62px)',
  display: 'flex',
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
  }
  & .MuiListItemIcon-root {
    transition: all 300ms linear;
    color: ${(props) => props.theme.palette.text.secondary};
  }
  &:hover {
    & .MuiTypography-root,& .MuiSvgIcon-root {
      color: #4c2FFC !important;
      transition: all 300ms linear;
    }
    background-color: ${(props) => props.theme.palette.background.hover};
    .MuiListItemIcon-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
  };
  &:hover .pin-icon {
    opacity: 1;
    color: ${(props) => props.theme.palette.primary.main};
  };
  &:hover .pin-icon * {
    color: ${(props) => props.theme.palette.primary.main};
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
    color: ${(props) => props.theme.palette.text.secondary};
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
      color: #4c2ffc !important;
    };
    .MuiListItemIcon-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
    .MuiAccordionSummary-expandIconWrapper {
      color: rgba(76, 47, 252, 0.54);
    };
  };
  &.Mui-expanded {
    min-height: 48px;
    border-right: solid 2px #4c2ffc;
    background-color: ${(props) => props.theme.palette.background.menu};
    .MuiTypography-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
    .MuiListItemIcon-root {
      color: ${(props) => props.theme.palette.primary.main};
    };
    & .MuiTypography-root,& .MuiSvgIcon-root {
      color: #4c2FFC !important;
      transition: color 300ms linear;
    }
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

// Mobile Layout

export const MobileMenu = styled(Box)`
  border-top-right-radius: ${(props) => props.theme.shape.radius};
  border-top-left-radius: ${(props) => props.theme.shape.radius};
  box-shadow: 0px -14px 24px rgba(76, 47, 252, 0.03);
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2;
`;

export const TopMobileMenu = styled(Box)`
  border-bottom-left-radius: ${(props) => props.theme.shape.radius};
  border-bottom-right-radius: ${(props) => props.theme.shape.radius};
`;

export const MobileSecondaryMenu = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
`;

export const TotalBalanceWrapper = styled(Box)`
  margin-top: 150px;
`;

export const LogoMenuWrapper = styled(Box)`
  position: fixed;
  background-color: ${(props) => props.theme.palette.background.white};
  z-index: 1;
  width: 100%;
`;
