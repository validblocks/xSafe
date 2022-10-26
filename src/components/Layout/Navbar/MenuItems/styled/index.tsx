import styled from 'styled-components';
import { ListItem } from 'src/components/Layout/Navbar/navbar-style';
import { ListItemIcon, ListItemText } from '@mui/material';

export const MenuListItem = styled(ListItem)(({ theme: _ }) => ({
  minHeight: 48,
  justifyContent: 'initial',
  padding: '8px 20px',
}));

export const MenuListItemIcon = styled(ListItemIcon)(({ theme: _ }) => ({
  minWidth: 0,
  marginRight: '8px',
  justifyContent: 'center',
  color: _.palette.text.primary,
}));

export const MenuListItemText = styled(ListItemText)(({ theme: _ }) => ({
  opacity: 1,
}));
