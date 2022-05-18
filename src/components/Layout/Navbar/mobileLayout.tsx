import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link } from 'react-router-dom';
import menuItems from 'utils/menuItems';
import TotalBalance from './TotalBalance';

const MobileLayout = () => {
  const locationString = location.pathname.substring(1);

  return (
    <Box>
      <TotalBalance />
      <Box>
        <Box className='d-flex bg-white justify-content-around mobile-menu'>
          {menuItems.mobileBottomItems.map((el, index) => (
            <Box
              className={
                locationString == el.link
                  ? 'active link-decoration py-4'
                  : 'link-decoration py-4'
              }
              key={index}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  top: '5px',
                  position: 'relative'
                }}
                className='pr-1'
              >
                {el.icon}
              </ListItemIcon>
              <Link className='link-decoration' to={el.link}>
                {el.name}
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        {(locationString === 'assets' ||
          locationString === 'tokens' ||
          locationString === 'nft') && (
          <Box>
            <Box
              className={
                locationString == 'tokens'
                  ? 'active-submenu assets-mobile-submenu py-3'
                  : 'assets-mobile-submenu py-3'
              }
            >
              <Link className='link-decoration' to='/tokens'>
                Tokens
              </Link>
            </Box>
            <Box
              className={
                locationString == 'nft'
                  ? 'active-submenu assets-mobile-submenu py-3'
                  : 'assets-mobile-submenu py-3'
              }
            >
              <Link className='link-decoration' to='/nft'>
                NFT&apos;s
              </Link>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MobileLayout;
