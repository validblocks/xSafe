import React from 'react';
import { useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { accessTokenServices, maiarIdApi } from 'services/accessTokenServices';

export const TokenWrapper = () => {
  const { isLoggedIn, loginMethod, tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccountInfo();

  if (accessTokenServices?.AccessTokenManager == null) {
    return null;
  }
  return (
    <accessTokenServices.AccessTokenManager
      loggedIn={isLoggedIn}
      loginMethod={loginMethod}
      userAddress={address}
      tokenLogin={tokenLogin}
      maiarIdApi={maiarIdApi}
    />
  );
};
