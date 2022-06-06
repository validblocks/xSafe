import {
  Menu,
  Box,
  Button,
  Typography,
  ListItemButton,
  AccordionSummary,
  AccordionDetails,
  List
} from '@mui/material';
import { Navbar as NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { ReactComponent as ElrondLogo } from 'assets/img/elrond.svg';
import CopyButton from 'components/CopyButton';

export const ConnectDropdown = styled(Menu)`
  top: 20px;
`;

export const ConnectItems = styled(Box)`
  background: var(--primary-background);
  color: var(--primary-color);
  border-radius: var(--radius);
`;

export const Anchor = styled.a`
  color: ${(props) => props.color} !important;
`;

export const CopyBtn = styled(CopyButton)`
  color: var(--link) !important;
`;

export const DisconnectButton = styled(Button)`
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  padding: 10px 16px;
  margin-top: 0px;
  top: 15px;
  border-radius: var(--radius);
  background: var(--danger-background);
`;

export const ReadOnly = styled(Typography)`
  border-radius: var(--radius);
  background: rgba(8, 4, 29, 0.1);
  color: #7a7883;
`;

export const MembersBox = styled(Box)`
  width: 91px;
  margin: auto;
  background-color: #f0f1fd;
  border-radius: 6px;
  margin-top: 10px;
  color: var(--primary-color);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const CenteredText = styled(Typography)`
  text-align: center;
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
`;

export const TopHeader = styled(Box)`
  position: absolute;
  z-index: 1;
  width: 100%;
`;

export const NavLogo = styled(NavItem)`
  cursor: pointer;
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
  &:after {
    content: '';
    box-shadow: 0px -26px 31px 0px rgba(100, 100, 111, 0.3);
    width: 100%;
    height: 40px;
    display: block;
    position: absolute;
    bottom: 75px;
    z-index: 9;
  }
`;

export const ListItem = styled(ListItemButton)`
  &:hover {
    color: var(--primary-color);
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
