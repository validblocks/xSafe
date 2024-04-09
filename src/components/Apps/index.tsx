import { useMemo } from 'react';
import Marketplace from '../../pages/Marketplace';
import MyApps from '../Marketplace/MyApps';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import ContainerWithPanels from 'src/components/Utils/ContainerWithPanels';
import Docs from './Docs';

const AppsPage = () => {
  const panels = useMemo(
    () =>
      import.meta.env.VITE_MVX_ENVIRONMENT === EnvironmentsEnum.mainnet
        ? [
            { title: 'Available Apps', content: <Marketplace /> },
            { title: 'My Apps', content: <MyApps /> },
          ]
        : [
            { title: 'Available Apps', content: <Marketplace /> },
            { title: 'My Apps', content: <MyApps /> },
            { title: 'Development', content: <Docs /> },
          ],
    [],
  );

  return <ContainerWithPanels panels={panels} />;
};

export default AppsPage;
