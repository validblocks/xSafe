import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPhotoUrlById, accountSelector } from 'src/redux/selectors/accountSelector';
import { ReactComponent as ElrondLogo } from 'src/assets/img/logo.svg';
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

  return { tokenPhotoJSX: photoUrl ? tokenPhotoJSX : <ElrondLogo className="mr-2" /> };
}
