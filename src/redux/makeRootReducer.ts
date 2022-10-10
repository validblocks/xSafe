import { combineReducers } from 'redux';
import appConfig from 'src/redux/slices/appConfigSlice';
import accountGeneralInfo from './slices/accountGeneralInfoSlice';
import addressBook from './slices/addressBookSlice';
import currency from './slices/currencySlice';
import economics from './slices/economicsSlice';
import modals from './slices/modalsSlice';
import multisigContracts from './slices/multisigContractsSlice';
import safeName from './slices/safeNameSlice';
import transactions from './slices/transactionsSlice';

export default function makeRootReducer() {
  return combineReducers({
    multisigContracts,
    modals,
    economics,
    appConfig,
    currency,
    safeName,
    addressBook,
    transactions,
    accountGeneralInfo,
  });
}
