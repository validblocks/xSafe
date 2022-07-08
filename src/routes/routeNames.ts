// import { foregroundRoutes, ForegroundRoutesType } from '.';

export default {
  welcome: '/welcome',
  dashboard: '/dashboard',

  decisions: '/decisions',

  decisionActions: '/decisions/:decisionsActionParam',

  multisigAddress: '/multisig/:multisigAddressParam',

  multisig: '/multisig',

  unlock: '/unlock',

  tokenTableRows: '/tokens',

  assets: '/assets',

  nft: '/nft',

  transactions: '/transactions',

  cvorum: '/cvorum',

  owners: '/owners',

  settings: '/settings',

  addressBook: '/address-book',
};
// export const foregroundRouteNames = Object.keys(foregroundRoutes).reduce(
//   (acc, cur) => ({
//     ...acc,
//     [cur]: foregroundRoutes[cur as ForegroundRoutesType].path,
//   }),
//   {} as Record<ForegroundRoutesType, string>,
// );

// export const routeNames = {
//   ...foregroundRouteNames,
// };
