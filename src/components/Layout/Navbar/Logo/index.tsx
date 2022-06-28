import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dAppName } from 'config';
import { uniqueContractAddress } from 'multisigConfig';
import { routeNames } from 'routes';
import { NavLogo, Logo, DappName } from '../navbar-style';

function NavbarLogo() {
  const handleRedirectToHome = () => {
    const route = uniqueContractAddress
      ? `/multisig/${uniqueContractAddress}`
      : routeNames.welcome;
    navigate(route);
  };

  const navigate = useNavigate();

  return (
    <NavLogo
      onClick={handleRedirectToHome}
      className='d-flex align-items-center'
    >
      <Logo />
      <DappName className='d-flex align-items-center'>{dAppName}</DappName>
    </NavLogo>
  );
}

export default NavbarLogo;
