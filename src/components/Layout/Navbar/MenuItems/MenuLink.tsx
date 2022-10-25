import { ListItemIcon, ListItemText } from '@mui/material';
import { theme } from 'src/components/Theme/createTheme';
import { Link, useLocation } from 'react-router-dom';
import { ListItem } from 'src/components/Layout/Navbar/navbar-style';
import { Text } from 'src/components/StyledComponents/StyledComponents';

interface IMenuLinkProps {
  menuItem: {
    name: string;
    id: string;
    link: string;
    icon: React.ReactElement;
  };
}

const MenuLink = ({ menuItem }: IMenuLinkProps) => {
  const location = useLocation();
  const locationString = location.pathname.substring(1);
  return (
    <Link
      key={menuItem.id}
      to={menuItem.link}
      className={
        locationString === menuItem.link
          ? 'active link-decoration'
          : 'link-decoration'
      }
    >
      <ListItem
        sx={{
          minHeight: 48,
          justifyContent: 'initial',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 1,
            justifyContent: 'center',
            color: theme.palette.text.primary,
          }}
        >
          {menuItem.icon}
        </ListItemIcon>
        <ListItemText
          primary={<Text>{menuItem.name}</Text>}
          sx={{ opacity: 1 }}
        />
      </ListItem>
    </Link>
  );
};

export default MenuLink;
