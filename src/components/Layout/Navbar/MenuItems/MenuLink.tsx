import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ModalTypes } from 'src/types/Proposals';
import * as Styled from './styled';

interface IMenuLinkProps {
  menuItem: {
    name: string;
    id: string;
    link: string;
    icon: React.ReactElement;
  };
  shouldRequireLogin?: boolean;
}

const MenuLink = ({ menuItem, shouldRequireLogin }: IMenuLinkProps) => {
  const location = useLocation();
  const locationString = location.pathname.substring(1);
  shouldRequireLogin = !!shouldRequireLogin;
  const dispatch = useDispatch();

  return (
    <Link
      key={menuItem.id}
      to={menuItem.link}
      onClick={(e: any) => {
        if (shouldRequireLogin) {
          e.preventDefault();
          dispatch(setProposeModalSelectedOption({ option: ModalTypes.connect_wallet }));
        }
      }}
      className={
        locationString === menuItem.link
          ? 'active link-decoration'
          : 'link-decoration'
      }
    >
      <Styled.MenuListItem>
        <Styled.MenuListItemIcon>
          {menuItem.icon}
        </Styled.MenuListItemIcon>
        <Styled.MenuListItemText
          primary={<Text>{menuItem.name}</Text>}
        />
      </Styled.MenuListItem>
    </Link>
  );
};

export default MenuLink;
