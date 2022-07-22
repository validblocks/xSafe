import MyStake from 'src/components/Stake/MyStake';
import { useMemo } from 'react';
import ContainerWithPanels from 'src/components/Utils/ContainerWithPanels';
import Providers from 'src/components/Providers';

const StakingDashboard = () => {
  const panels = useMemo(() => [
    { title: 'My Stake', content: <MyStake /> },
    { title: 'Providers', content: <Providers /> },
  ], []);

  return (
    <ContainerWithPanels
      panels={panels}
    />
  );
};

export default StakingDashboard;
