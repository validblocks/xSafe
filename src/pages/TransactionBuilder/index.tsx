import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { TemplateMarketplacePanel } from 'src/components/TemplateMarketplace/TemplateMarketplacePanel';
import { TransactionBuilderPanel } from 'src/components/TransactionBuilder/TransactionBuilderPanel';
import ContainerWithPanels from 'src/components/Utils/ContainerWithPanels';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import routeNames from 'src/routes/routeNames';
import { parseMultisigAddress } from 'src/utils/addressUtils';

export const TransactionBuilder = () => {
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
        title: 'Smart Contract Interactions',
        content: <TransactionBuilderPanel />,
        tab: 'sc-interactions',
      },
      {
        title: 'Template Marketplace',
        content: <TemplateMarketplacePanel />,
        tab: 'template-marketplace',
      },
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
};
