import {
  Menu,
  Box,
  Button,
  Typography,
  ListItemButton,
  AccordionSummary,
  AccordionDetails,
  List,
} from '@mui/material';
import { Navbar as NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { ReactComponent as ElrondLogo } from 'src/assets/img/elrond.svg';
import CopyButton from 'src/components/CopyButton';

export const ConnectDropdown = styled(Menu)`
  top: 20px;
`;

export const ConnectItems = styled(Box)`
  background: ${(props) => props.theme.palette.background.main};
  color: ${(props) => props.theme.palette.primary.main};
  border-radius: ${(props) => props.theme.shape.radius};
`;
export const CopyBtn = styled(CopyButton)`
  color: ${(props) => props.theme.palette.anchor.main} !important;
`;

export const DisconnectButton = styled(Button)`
  color: ${(props) => props.theme.palette.danger.main};
  border: 1px solid
    ${(props) => props.theme.palette.danger.main};
  padding: 10px 16px;
  margin-top: 0px;
  top: 15px;
  border-radius: ${(props) => props.theme.shape.radius};
  background: ${(props) => props.theme.palette.background.danger};
`;

export const ReadOnly = styled(Typography)`
  border-radius: .4rem;
  background: rgba(8, 4, 29, 0.1);
  color: #7a7883;
  font-size: 14px;
  padding: 2px 9px;
`;

export const Anchor = styled.a`
  color: ${(props) => props.color} !important;
`;

export const MembersBox = styled(Box)`
  width: 17px;
  margin: auto;
  background-color: #E4DFFF;
  border-radius: 4px;
  margin-top: 10px;
  color: ${(props) => props.theme.palette.primary.main};
`;

export const CenteredText = styled(Typography)`
  @media (max-width: 600px) {
    text-align: left;
  }
  text-align: center;
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
`;

export const TopHeader = styled(Box)`
  position: absolute;
  z-index: 1;
  background: ${(props) => props.theme.palette.background.default};
`;

export const NavLogo = styled(NavItem)`
  cursor: pointer;
  padding: 0 1rem;
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

export const TopMenu = styled(Box)`
  overflow-y: scroll;
  height: 100%;
  z-index: 0;
`;

export const ListItem = styled(ListItemButton)`
  &:hover {
    color: ${(props) => props.theme.palette.primary.main};
    background-color: #f5f7ff !important;
  }
`;

export const BreadcrumbsWrapper = styled(Box)`
  margin-left: 260px;
`;

export const MenuAccordion = styled(AccordionSummary)`
  .MuiAccordionSummary-content {
    margin: 0px;
  }
`;

export const AccordionDetail = styled(AccordionDetails)`
  .link-hover {
    padding-left: 43px;
  }
`;

export const BottomMenu = styled(List)`
  bottom: 10px;
  width: 100%;
  z-index: 9;
`;

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
