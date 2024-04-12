import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import routeNames from 'src/routes/routeNames';
import { parseMultisigAddress } from 'src/utils/addressUtils';
import { useEffect, useMemo, useState } from 'react';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import ContainerWithPanels from 'src/components/Utils/ContainerWithPanels';
import { SafeDetails } from 'src/components/MultisigDetails/SafeDetails';
import Dashboard from '../Dashboard/DashboardPage';

function MultisigDetailsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useGetLoginInfo();
  const currentContract = useSelector(currentMultisigContractSelector);

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

  const panels = useMemo(
    () => [
      {
        title: 'Safe overview',
        content: <SafeDetails />,
        tab: 'safe-overview',
      },
      { title: 'New Safe', content: <Dashboard />, tab: 'new-safe' },
    ],
    [],
  );

  const [tabIndex, setTabIndex] = useState(
    tabFromQuery &&
      panels.findIndex((panel) => panel.tab === tabFromQuery) !== -1
      ? panels.findIndex((panel) => panel.tab === tabFromQuery)
      : 0,
  );

  useEffect(() => {
    navigate(`?tab=${panels[tabIndex].tab}`);
  }, [navigate, panels, tabIndex]);

  useEffect(() => {
    const index = panels.findIndex((panel) => panel.tab === tabFromQuery);

    if (index !== -1) {
      setTabIndex(index);
    }
  }, [navigate, panels, tabFromQuery]);

  return (
    <div>
      <ContainerWithPanels
        panels={panels}
        initialTabIndex={tabIndex}
        onTabChange={(tab: number) => setTabIndex(tab)}
      />
    </div>
  );
}

export default MultisigDetailsPage;
