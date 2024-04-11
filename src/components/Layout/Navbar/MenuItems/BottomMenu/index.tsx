import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { Box } from '@mui/system';
import { HtmlTooltip } from 'src/components/Utils/HtmlTooltip';
import { BottomMenuList } from '../../navbar-style';
import MenuLink from '../MenuLink';
import { uniqueId } from 'lodash';
import { bottomItems } from 'src/apps/apps';

const BottomMenu = () => {
  const { isLoggedIn } = useGetLoginInfo();
  return (
    <BottomMenuList>
      {bottomItems.map((el) => {
        if (el.id !== 'help-center-menu-item') {
          if (!isLoggedIn) {
            return (
              <HtmlTooltip
                key={uniqueId()}
                arrow
                title={<span className="ml-1">{'Please login first!'}</span>}
                placement="right"
              >
                <Box key={uniqueId()}>
                  <MenuLink shouldRequireLogin menuItem={el} />
                </Box>
              </HtmlTooltip>
            );
          }

          return <MenuLink key={uniqueId()} menuItem={el} />;
        }

        return (
          <Box key={uniqueId()}>
            <MenuLink menuItem={el} />
          </Box>
        );
      })}
    </BottomMenuList>
  );
};

export default BottomMenu;
