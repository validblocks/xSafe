import MyStake from 'src/components/Stake/MyStake';
import { useMemo } from 'react';
import ContainerWithPanels from 'src/components/Utils/ContainerWithPanels';

const StakingDashboard = () => {
  const panels = useMemo(() => [
    { title: 'My Stake', content: <MyStake /> },
  ], []);

  return (
    <ContainerWithPanels
      panels={panels}
    />
  );
};

export default StakingDashboard;
