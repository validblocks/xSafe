import { DisconnectButton } from '../Layout/Navbar/navbar-style';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCallback } from 'react';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { useLogoutLogic } from 'src/hooks/useLogoutLogic';

interface IProps {
  enableMobileStyle?: boolean;
  logoutCallback?: CallableFunction;
}

const mobileLogoutButtonStyle = {
  padding: '5px 0 !important',
  top: '0 !important',
  minWidth: 38,
  boxSizing: 'border-box',
  width: '38px !important',
  height: '38px !important',
};

export const LogoutButton = ({
  enableMobileStyle = false,
  logoutCallback,
}: IProps) => {
  const { logoutWithCleanup } = useLogoutLogic({
    afterLogoutCallback: logoutCallback,
  });
  const theme = useCustomTheme();

  const handleLogoutClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await logoutWithCleanup();
    },
    [logoutWithCleanup],
  );

  return (
    <DisconnectButton
      variant="outlined"
      onClick={handleLogoutClick}
      sx={{
        width: '100%',
        padding: '.5rem 0',
        '& .MuiSvgIcon-root': {
          color: '#e51a3e !important',
        },
        '&:hover .MuiSvgIcon-root': {
          color: `${theme.palette.text.primary} !important`,
          transition: 'color 0.3s',
        },
        ...(enableMobileStyle && mobileLogoutButtonStyle),
      }}
    >
      <div>
        <LogoutIcon sx={{ mr: enableMobileStyle ? 0 : 1 }} />
        {!enableMobileStyle && <span>{'Disconnect Wallet'}</span>}
      </div>
    </DisconnectButton>
  );
};
