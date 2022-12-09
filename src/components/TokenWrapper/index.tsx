import { refreshAccount, useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { useEffect } from 'react';
import * as DappCoreInternal from '@elrondnetwork/dapp-core-internal';

export const TokenWrapper = () => {
  const { isLoggedIn, loginMethod, tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccountInfo();

  useEffect(() => {
    if (isLoggedIn) { refreshAccount(); }
  }, [isLoggedIn, address]);

  if (DappCoreInternal.AccessTokenManager == null) {
    console.error('Error: AccessTokenManager not found!');
    return null;
  }

  console.log({ isLoggedIn, tokenLogin, loginMethod, address });

  return (
    <DappCoreInternal.AccessTokenManager
      loggedIn={isLoggedIn}
      loginMethod={loginMethod}
      userAddress={address}
      tokenLogin={tokenLogin}
      maiarIdApi={''}
    />
  );
};
