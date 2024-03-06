import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { RootState } from '../store';

const appConfigSelector = (state: RootState) => state.appConfig;

export const multisigOriginSelector = createDeepEqualSelector(
  appConfigSelector,
  (state) => state.multisigOrigin,
);

export const isDarkThemeEnabledSelector = createDeepEqualSelector(
  appConfigSelector,
  (state) => state.selectedTheme === 'Dark',
);

export const selectedThemeSelector = createDeepEqualSelector(
  appConfigSelector,
  (state) => state.selectedTheme,
);
