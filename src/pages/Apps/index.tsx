/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react';
import ContainerWithPanels from 'src/components/Utils/ContainerWithPanels';
import Marketplace from '../Marketplace';
import MyApps from '../Marketplace/MyApps';

const AppsPage = () => {
  const panels = useMemo(() => [
    { title: 'Available Apps', content: <Marketplace /> },
    { title: 'My Apps', content: <MyApps /> },
    // { title: 'Development', content: <Docs /> },
  ], []);

  return <ContainerWithPanels panels={panels} />;
};

export default AppsPage;
