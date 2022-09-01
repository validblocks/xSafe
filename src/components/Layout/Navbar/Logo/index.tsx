import { dAppName } from 'src/config';
import { uniqueContractAddress } from 'src/multisigConfig';
import { useNavigate } from 'react-router-dom';
import routeNames from 'src/routes/routeNames';
import { ReactComponent as ControlLightLogo } from 'src/assets/img/ControlLogoLight.svg';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { NavLogo } from '../navbar-style';

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
      <ControlLightLogo />
      <Text
        fontWeight={700}
        fontSize={21}
        textTransform="uppercase"
        letterSpacing={1}
        marginLeft="3px"
      >{dAppName}
      </Text>
    </NavLogo>
  );
};

export default NavbarLogo;
