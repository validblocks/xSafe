import { refreshAccount, useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { useEffect } from 'react';
import { accessTokenServices } from 'src/services/accessTokenServices';

export const TokenWrapper = () => {
  const { isLoggedIn, loginMethod, tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccountInfo();

  useEffect(() => {
    if (isLoggedIn) { refreshAccount(); }
  }, [isLoggedIn]);

  if (accessTokenServices?.AccessTokenManager == null) {
    console.error('Error: AccessTokenManager not found!');
    return null;
  }

  console.log({ isLoggedIn, tokenLogin, loginMethod, address });

  return (
    <accessTokenServices.AccessTokenManager
      loggedIn={isLoggedIn}
      loginMethod={loginMethod}
      userAddress={address}
      tokenLogin={tokenLogin}
      maiarIdApi={''}
    />
  );
};
