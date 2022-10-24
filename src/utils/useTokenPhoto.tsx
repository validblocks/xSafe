import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPhotoUrlById, accountSelector } from 'src/redux/selectors/accountSelector';
import { ReactComponent as ElrondLogo } from 'src/assets/img/logo.svg';
import { ReactComponent as ElrondLogoWhite } from 'src/assets/img/elrond-logo-white.svg';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';

interface IUseTokenPhotoOptions {
    width?: number;
    height?: number;
}

export default function useTokenPhoto(identifier: string, options: IUseTokenPhotoOptions = {
  width: 30,
  height: 30,
}) {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const tokenPhotoByUrlSelector = useMemo(() => createDeepEqualSelector(accountSelector,
    (state: StateType) => getTokenPhotoUrlById(state, identifier)), [identifier]);
  const photoUrl = useSelector<StateType, string>(tokenPhotoByUrlSelector);
  const [tokenPhotoJSX, setTokenPhotoJSX] = useState(
    <img width={options.width} height={options.height} src={photoUrl} alt="token" className="mr-2" />,
  );

  useEffect(() => {
    setTokenPhotoJSX(
      <img width={options.width} height={options.height} src={photoUrl} alt="token" className="mr-2" />,
    );
  }, [options.height, options.width, photoUrl]);

  const [elrondLogo, setElrondLogo] = useState(() =>
    (isDarkThemeEnabled ? <ElrondLogoWhite className="mr-2" /> : <ElrondLogo className="mr-2" />),
  );

  useEffect(() => {
    setElrondLogo(isDarkThemeEnabled ? <ElrondLogoWhite className="mr-2" /> : <ElrondLogo className="mr-2" />);
  }, [isDarkThemeEnabled]);

  return { tokenPhotoJSX: photoUrl ? tokenPhotoJSX : elrondLogo };
}
