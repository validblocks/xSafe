import React from 'react';
import { getIsLoggedIn } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ElrondLogo } from 'assets/img/elrond.svg';
import { ReactComponent as Union } from 'assets/img/Union.svg';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import { uniqueContractAddress } from '../../../multisigConfig';
import Account from './Account';

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = getIsLoggedIn();

  const handleRedirectToHome = () => {
    const route = uniqueContractAddress
      ? '/multisig/' + uniqueContractAddress
      : routeNames.home;
    navigate(route);
  };

  const isOnUnlockPage = window.location.pathname.includes(routeNames.unlock);
  return (
    <BsNavbar className='bg-white px-4 py-3'>
      <div className='container'>
        <NavItem
          onClick={handleRedirectToHome}
          className='d-flex align-items-center nav-logo'
        >
          <ElrondLogo className='elrond-logo' />
          <span className='dapp-name'>{dAppName}</span>
        </NavItem>

        <Nav className='ml-auto'>
          {loggedIn ? (
            <div
              className='d-flex align-items-center logged-in'
              style={{ minWidth: 0 }}
            >
              <Account />
              {/* <Settings /> */}
            </div>
          ) : (
            !isOnUnlockPage && (
              <div className='connect-btns '>
                <Link
                  to={routeNames.unlock}
                  className='btn primary'
                  data-testid='loginBtn'
                >
                  <Union />
                  <span className='name'>Connect now</span>
                </Link>
              </div>
            )
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
