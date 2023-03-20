import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { Box } from '@mui/system';
import { HtmlTooltip } from 'src/components/Utils/HtmlTooltip';
import menuItems from 'src/utils/menuItems';
import { BottomMenuList } from '../../navbar-style';
import MenuLink from '../MenuLink';

const BottomMenu = () => {
  const { isLoggedIn } = useGetLoginInfo();
  const { bottomItems } = menuItems;
  return (
    <BottomMenuList>
      {bottomItems.map((el) => {
        if (el.id !== 'help-center-menu-item') {
          if (!isLoggedIn) {
            return (
              <HtmlTooltip
                key={el.id}
                arrow
                title={(
                  <span className="ml-1">{'Please login first!'}</span>
                )}
                placement="right"
              >
                <Box>
                  <MenuLink shouldRequireLogin menuItem={el} />
                </Box>
              </HtmlTooltip>
            );
          }

          return (
            <MenuLink key={el.id} menuItem={el} />
          );
        }

        return (
          <Box>
            <MenuLink menuItem={el} />
          </Box>
        );
      })}
    </BottomMenuList>
  );
};

export default BottomMenu;
