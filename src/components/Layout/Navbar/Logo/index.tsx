import { dAppName } from 'src/config';
import { uniqueContractAddress } from 'src/multisigConfig';
import { useNavigate } from 'react-router-dom';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { NavLogo } from '../navbar-style';

const NavbarLogo = () => {
  const navigate = useNavigate();
  const handleRedirectToHome = () => {
    const route = `/multisig/${uniqueContractAddress}`;
    navigate(route);
  };

  return (
    <NavLogo
      onClick={handleRedirectToHome}
      className="p-0 d-flex align-items-center"
    >
      <Text
        fontWeight={700}
        fontSize={26}
        letterSpacing={1}
        marginLeft="3px"
      >{dAppName}
      </Text>
    </NavLogo>
  );
};

export default NavbarLogo;
