import { RouteType as DappCoreRouteTypes } from '@elrondnetwork/dapp-core';
import Welcome from 'src/pages/Welcome';
import Dashboard from 'src/pages/Dashboard';
import Decisions from 'src/pages/Decisions';
import DecisionActions from 'src/pages/DecisionActions';
import MultisigDetailsPage from 'src/pages/MultisigDetails/MultisigDetailsPage';
import Unlock from 'src/pages/Unlock';
import AssetsPage from 'src/pages/AssetsPage/AssetsPage';
import NftPage from 'src/pages/NftPage';
import TransactionsPage from 'src/pages/Transactions/TransactionsPage';
import CvorumContainer from 'src/pages/Organization/CvorumContainer';
import OrganizationTokens from 'src/pages/Organization/OrganizationTokens';
import Settings from 'src/pages/Settings';
import AddressBook from 'src/pages/AddressBook';
import { dAppName } from 'src/config';
import withPageTitle from 'src/components/PageTitle';
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
    component: AssetsPage,
  },
  assets: {
    path: '/assets',
    title: 'Assets',
    component: AssetsPage,
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
    component: OrganizationTokens,
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
  home: {} as RouteType,
};

const routes: RouteType[] = [
  ...Object.keys(foregroundRoutes).map((route) => {
    const {
      path, title, authenticatedRoute, component,
    } =
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
