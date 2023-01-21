import { useNavigate } from 'react-router-dom';
import { XSafeLogo } from 'src/components/Utils/XSafeLogo';
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
      <XSafeLogo />
    </NavLogo>
  );
};

export default NavbarLogo;
