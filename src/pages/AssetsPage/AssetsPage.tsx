import AssetsTable from 'src/components/Assets/AssetsTable';

import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import routeNames from 'src/routes/routeNames';
import { parseMultisigAddress } from 'src/utils/addressUtils';
import { useEffect, useState } from 'react';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import ContainerWithPanels from 'src/components/Utils/ContainerWithPanels';
import { useMediaQuery } from '@mui/material';
import NftPage from '../NftPage';
import { MobileAssetsPage } from './MobileAssetsPage';

const panels = [
  {
    title: 'Tokens',
    content: <MobileAssetsPage />,
    tab: 'tokens',
  },
  { title: 'NFTs', content: <NftPage />, tab: 'nfts' },
];

function AssetsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useGetLoginInfo();
  const currentContract = useSelector(currentMultisigContractSelector);
  const isOnMobile = useMediaQuery('(max-width: 600px)');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');

  useEffect(() => {
    if (
      !isLoggedIn ||
      !currentContract?.address ||
      !parseMultisigAddress(currentContract?.address)
    ) {
      navigate(routeNames.multisig);
    }
  }, [currentContract?.address, isLoggedIn, navigate]);

  const [tabIndex, setTabIndex] = useState(
    tabFromQuery &&
      panels.findIndex((panel) => panel.tab === tabFromQuery) !== -1
      ? panels.findIndex((panel) => panel.tab === tabFromQuery)
      : 0,
  );

  useEffect(() => {
    if (isOnMobile) navigate(`?tab=${panels[tabIndex].tab}`);
  }, [navigate, tabIndex, tabFromQuery, isOnMobile]);

  useEffect(() => {
    const index = panels.findIndex((panel) => panel.tab === tabFromQuery);

    if (index !== -1) {
      setTabIndex(index);
    }
  }, [navigate, tabFromQuery]);

  return !isOnMobile ? (
    <AssetsTable />
  ) : (
    <div>
      <ContainerWithPanels
        panels={panels}
        initialTabIndex={tabIndex}
        onTabChange={(tab: number) => setTabIndex(tab)}
      />
    </div>
  );
}

export default AssetsPage;
