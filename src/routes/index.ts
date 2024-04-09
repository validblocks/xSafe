import DashboardPage from 'src/pages/Dashboard/DashboardPage';
import MultisigDetailsPage from 'src/pages/MultisigDetails/MultisigDetailsPage';
import Unlock from 'src/pages/Unlock';
import AssetsTable from 'src/pages/AssetsPage/AssetsPage';
import NftPage from 'src/pages/NftPage';
import TransactionsPage from 'src/pages/Transactions/TransactionsPage';
import CvorumContainer from 'src/components/Organization/CvorumContainer';
import OrganizationMembers from 'src/pages/Organization/OrganizationMembers';
import Settings from 'src/pages/Settings';
import AddressBook from 'src/pages/AddressBook';
import { dAppName } from 'src/config';
import withPageTitle from 'src/components/PageUtils/PageTitle';
import StakingDashboard from 'src/pages/Stake/StakingDashboard';
import { uniqueContractAddress } from 'src/multisigConfig';
import AppsPage from 'src/components/Apps';
import HelpCenter from 'src/pages/HelpCenter';
import routeNames from './routeNames';
import { ForegroundRoutesType } from '../types/routes';
import { TransactionBuilder } from 'src/pages/TransactionBuilder';

type RouteType = any & { title: string };

export type ModalRoutesType = 'walletconnect' | 'ledger';

export const foregroundRoutes: Record<ForegroundRoutesType, any> = {
  dashboard: {
    path: routeNames.dashboard,
    title: 'Dashboard',
    component: MultisigDetailsPage,
    authenticatedRoute: true,
  },
  multisigAddress: {
    path: '/multisig/:multisigAddressParam',
    title: 'Dashboard',
    component: MultisigDetailsPage,
    authenticatedRoute: true,
  },
  multisig: {
    path: '/multisig',
    title: '',
    component: DashboardPage,
  },
  unlock: {
    path: '/unlock',
    title: 'Unlock',
    component: Unlock,
  },
  tokenTableRows: {
    path: '/tokens',
    title: 'Organization Tokens',
    component: AssetsTable,
  },
  assets: {
    path: '/assets',
    title: 'Assets',
    component: AssetsTable,
  },
  nft: {
    path: '/nft',
    title: 'NFT',
    component: NftPage,
  },
  transactions: {
    path: '/transactions',
    title: 'Transactions',
    component: TransactionsPage,
  },
  cvorum: {
    path: '/cvorum',
    title: 'Cvorum',
    component: CvorumContainer,
  },
  members: {
    path: '/members',
    title: 'Members',
    component: OrganizationMembers,
  },
  settings: {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  'help-center': {
    path: '/help-center',
    title: 'Help Center',
    component: HelpCenter,
  },
  addressBook: {
    path: '/address-book',
    title: 'Address Book',
    component: AddressBook,
  },
  stake: {
    path: '/stake',
    title: 'Stake',
    component: StakingDashboard,
  },
  apps: {
    path: '/apps',
    title: 'Apps',
    component: AppsPage,
  },
  transactionBuilder: {
    path: '/transaction-builder',
    title: 'Smart Contract Interactions',
    component: TransactionBuilder,
  },
  home: {
    title: 'Home',
    path: '/',
    component:
      uniqueContractAddress.length > 0 ? MultisigDetailsPage : DashboardPage,
  } as RouteType,
};

const routes: RouteType[] = [
  ...Object.keys(foregroundRoutes).map((route) => {
    const { path, title, authenticatedRoute, component } =
      foregroundRoutes[route as ForegroundRoutesType];
    return {
      path,
      title,
      authenticatedRoute,
      component,
    };
  }),
];

const wrappedRoutes = () =>
  routes.map((route) => {
    const title = route.title ? `${dAppName} • ${route.title}` : `${dAppName}`;
    return {
      path: route.path,
      authenticatedRoute: Boolean(route.authenticatedRoute),
      component: withPageTitle(
        title,
        route.component,
      ) as any as React.ComponentClass<any, any>,
    };
  });

export default wrappedRoutes();
