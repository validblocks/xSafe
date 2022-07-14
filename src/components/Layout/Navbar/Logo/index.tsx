import { dAppName } from 'src/config';
import { uniqueContractAddress } from 'src/multisigConfig';
import { useNavigate } from 'react-router-dom';
import routeNames from 'src/routes/routeNames';
import { NavLogo, Logo, DappName } from '../navbar-style';

const NavbarLogo = () => {
  const navigate = useNavigate();
  const handleRedirectToHome = () => {
    const route = uniqueContractAddress
      ? `/multisig/${uniqueContractAddress}`
      : routeNames.welcome;
    navigate(route);
  };

  return (
    <NavLogo
      onClick={handleRedirectToHome}
      className="d-flex align-items-center"
    >
      <Logo />
      <DappName className="d-flex align-items-center">{dAppName}</DappName>
    </NavLogo>
  );
}

export default NavbarLogo;
