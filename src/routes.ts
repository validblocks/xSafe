import React from 'react';
import { RouteType as DappCoreRouteTypes } from '@elrondnetwork/dapp-core';
import { dAppName } from 'config';
import AssetsPage from 'pages/AssetsPage/AssetsPage';
import Decisions from 'pages/Decisions';
import CvorumContainer from 'pages/Organization/CvorumContainer';
import OrganizationTokens from 'pages/Organization/OrganizationTokens';
import TransactionsPage from 'pages/Transactions/TransactionsPage';
import Unlock from 'pages/Unlock';
import withPageTitle from './components/PageTitle';
import AddressBook from './pages/AddressBook';
import Dashboard from './pages/Dashboard';
import DecisionActions from './pages/DecisionActions';
import Home from './pages/Home';
import MultisigDetailsPage from './pages/MultisigDetails/MultisigDetailsPage';
import Settings from './pages/Settings';

type RouteType = DappCoreRouteTypes & { title: string };

export type ForegroundRoutesType =
  | 'unlock'
  | 'home'
  | 'dashboard'
  | 'decisions'
  | 'decisionActions'
  | 'multisig'
  | 'multisigAddress'
  | 'organizationTokens'
  | 'assets'
  | 'cvorum'
  | 'owners'
  | 'transactions'
  | 'settings'
  | 'addressBook';
export type ModalRoutesType = 'walletconnect' | 'ledger';

export const foregroundRoutes: Record<ForegroundRoutesType, RouteType> = {
  home: {
    path: '/',
    title: 'Home',
    component: Home
  },
  dashboard: {
    path: '/dashboard',
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true
  },
  decisions: {
    path: '/decisions',
    title: 'Decisions',
    component: Decisions,
    authenticatedRoute: true
  },
  decisionActions: {
    path: '/decisions/:decisionsActionParam',
    title: 'Decision Actions',
    component: DecisionActions,
    authenticatedRoute: true
  },
  multisigAddress: {
    path: '/multisig/:multisigAddressParam',
    title: 'Multisig',
    component: MultisigDetailsPage,
    authenticatedRoute: true
  },
  multisig: {
    path: '/multisig',
    title: 'Multisig Details',
    component: Dashboard,
    authenticatedRoute: true
  },
  unlock: {
    path: '/unlock',
    title: 'Unlock',
    component: Unlock
  },
  organizationTokens: {
    path: '/tokens',
    title: 'Organization Tokens',
    component: AssetsPage
  },
  assets: {
    path: '/assets',
    title: 'Assets',
    component: AssetsPage
  },
  transactions: {
    path: '/transactions',
    title: 'Transactions',
    component: TransactionsPage
  },
  cvorum: {
    path: '/cvorum',
    title: 'Cvorum',
    component: CvorumContainer
  },
  owners: {
    path: '/owners',
    title: 'Owners',
    component: OrganizationTokens
  },
  settings: {
    path: '/settings',
    title: 'Settings',
    component: Settings
  },
  addressBook: {
    path: '/address-book',
    title: 'Address Book',
    component: AddressBook
  }
};

export const foregroundRouteNames = Object.keys(foregroundRoutes).reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: foregroundRoutes[cur as ForegroundRoutesType].path
  }),
  {} as Record<ForegroundRoutesType, string>
);

export const routeNames = {
  ...foregroundRouteNames
};

const routes: RouteType[] = [
  ...Object.keys(foregroundRoutes).map((route) => {
    const { path, title, authenticatedRoute, component } =
      foregroundRoutes[route as ForegroundRoutesType];
    return { path, title, authenticatedRoute, component };
  })
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
        route.component
      ) as any as React.ComponentClass<any, any>
    };
  });

export default wrappedRoutes();
