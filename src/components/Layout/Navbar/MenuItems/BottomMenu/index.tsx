import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { Box } from '@mui/system';
import { HtmlTooltip } from 'src/components/Utils/HtmlTooltip';
import menuItems from 'src/utils/menuItems';
import { BottomMenuList } from '../../navbar-style';
import MenuLink from '../MenuLink';
import { uniqueId } from 'lodash';

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
                key={uniqueId()}
                arrow
                title={(
                  <span className="ml-1">{'Please login first!'}</span>
                )}
                placement="right"
              >
                <Box key={uniqueId()}>
                  <MenuLink shouldRequireLogin menuItem={el} />
                </Box>
              </HtmlTooltip>
            );
          }

          return (
            <MenuLink key={uniqueId()} menuItem={el} />
          );
        }

        return (
          <Box>
            <MenuLink key={uniqueId()} menuItem={el} />
          </Box>
        );
      })}
    </BottomMenuList>
  );
};

export default BottomMenu;
