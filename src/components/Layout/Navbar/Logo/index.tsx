import { useNavigate } from 'react-router-dom';
import xSafeLogo from 'src/assets/img/xSafe-Logo.svg';
import { NavLogo } from '../navbar-style';

const NavbarLogo = () => {
  const navigate = useNavigate();
  const handleRedirectToHome = () => {
    const route = '/multisig';
    navigate(route);
  };

  return (
    <NavLogo
      onClick={handleRedirectToHome}
      className="px-3 pt-2 pb-0 d-flex align-items-center"
    >
      <img src={xSafeLogo} alt="Logo" />
    </NavLogo>
  );
};

export default NavbarLogo;
