import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPhotoUrlById, accountSelector } from 'src/redux/selectors/accountSelector';
import ElrondLogo from 'src/assets/img/logo.svg';
import ElrondLogoWhite from 'src/assets/img/multiversx-symbol.svg';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';

interface ITokenPhotoOptions {
    width?: number;
    height?: number;
}

interface Props {
    identifier: string;
    options?: ITokenPhotoOptions
}

export const TokenPhoto = ({ identifier, options = {
  width: 30,
  height: 30,
} }: Props) => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const tokenPhotoByUrlSelector = useMemo(() => createDeepEqualSelector(accountSelector,
    (state: StateType) => getTokenPhotoUrlById(state, identifier)), [identifier]);
  const photoUrl = useSelector<StateType, string>(tokenPhotoByUrlSelector);

  if (identifier === 'EGLD') {
    return isDarkThemeEnabled
      ? (
        <img
          width={options.width}
          height={options.height}
          src={ElrondLogoWhite}
          alt="token"
          className="mr-2"
        />
      ) : (
        <img
          width={options.width}
          height={options.height}
          src={ElrondLogo}
          alt="token"
          className="mr-2"
        />
      );
  }

  return <img width={options.width} height={options.height} src={photoUrl} alt="token" className="mr-2" />;
};
