import { RouteType as DappCoreRouteTypes } from '@elrondnetwork/dapp-core';
import Welcome from 'src/pages/Welcome';
import Dashboard from 'src/pages/Dashboard/DashboardPage';
import Decisions from 'src/pages/Decisions';
import DecisionActions from 'src/pages/DecisionActions';
import MultisigDetailsPage from 'src/pages/MultisigDetails/MultisigDetailsPage';
import Unlock from 'src/pages/Unlock';
import AssetsTable from 'src/pages/AssetsPage/AssetsPage';
import NftPage from 'src/pages/NftPage';
import TransactionsPage from 'src/pages/Transactions/TransactionsPage';
import CvorumContainer from 'src/pages/Organization/CvorumContainer';
import OrganizationOwners from 'src/pages/Organization/OrganizationOwners';
import Settings from 'src/pages/Settings';
import AddressBook from 'src/pages/AddressBook';
import { dAppName } from 'src/config';
import withPageTitle from 'src/components/PageTitle';
import StakingDashboard from 'src/pages/Stake/StakingDashboard';
import Marketplace from 'src/pages/Marketplace';
import routeNames from './routeNames';

type RouteType = DappCoreRouteTypes & { title: string };

export type ForegroundRoutesType =
  | 'welcome'
  | 'unlock'
  | 'home'
  | 'dashboard'
  | 'decisions'
  | 'decisionActions'
  | 'multisig'
  | 'multisigAddress'
  | 'tokenTableRows'
  | 'assets'
  | 'cvorum'
  | 'owners'
  | 'transactions'
  | 'settings'
  | 'nft'
  | 'stake'
  | 'marketplace'
  | 'addressBook';

export type ModalRoutesType = 'walletconnect' | 'ledger';

export const foregroundRoutes: Record<ForegroundRoutesType, RouteType> = {
  welcome: {
    path: routeNames.welcome,
    title: 'Welcome',
    component: Welcome,
  },
  dashboard: {
    path: routeNames.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true,
  },
  decisions: {
    path: routeNames.decisions,
    title: 'Decisions',
    component: Decisions,
    authenticatedRoute: true,
  },
  decisionActions: {
    path: routeNames.decisionActions,
    title: 'Decision Actions',
    component: DecisionActions,
    authenticatedRoute: true,
  },
  multisigAddress: {
    path: '/multisig/:multisigAddressParam',
    title: 'Multisig',
    component: MultisigDetailsPage,
    authenticatedRoute: true,
  },
  multisig: {
    path: '/multisig',
    title: 'Multisig Details',
    component: Dashboard,
    authenticatedRoute: true,
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
  owners: {
    path: '/owners',
    title: 'Owners',
    component: OrganizationOwners,
  },
  settings: {
    path: '/settings',
    title: 'Settings',
    component: Settings,
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
  marketplace: {
    path: '/marketplace',
    title: 'Marketplace',
    component: Marketplace,
  },
  home: {} as RouteType,
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
    const title = route.title
      ? `${route.title} • Elrond ${dAppName}`
      : `Elrond ${dAppName}`;
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
