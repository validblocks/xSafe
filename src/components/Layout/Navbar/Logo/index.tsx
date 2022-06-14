import React, { useState, useEffect } from 'react';
import { NavLogo, Logo, DappName } from '../navbar-style';
import { dAppName } from 'config';
import { uniqueContractAddress } from 'multisigConfig';
import { useNavigate } from 'react-router-dom';
import { routeNames } from 'routes';

const NavbarLogo = () => {
  const handleRedirectToHome = () => {
    const route = uniqueContractAddress
      ? '/multisig/' + uniqueContractAddress
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
};

export default NavbarLogo;
