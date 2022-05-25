import { combineReducers } from 'redux';
import account from './slices/accountSlice';
import appConfig from './slices/appConfigSlice';
import currency from './slices/currencySlice';
import totalValue from './slices/currencySlice';
import economics from './slices/economicsSlice';
import modals from './slices/modalsSlice';
import multisigContracts from './slices/multisigContractsSlice';

export default function makeRootReducer() {
  return combineReducers({
    multisigContracts,
    modals,
    economics,
    account,
    appConfig,
    currency,
    totalValue
  });
}
