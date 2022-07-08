import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { organizationTokenPhotoUrlSelector } from 'src/redux/selectors/accountSelector';
import { ReactComponent as ElrondLogo } from 'src/assets/img/logo.svg';

interface IUseTokenPhotoOptions {
    width?: number;
    height?: number;
}

export default function useTokenPhoto(identifier: string, options: IUseTokenPhotoOptions = {
  width: 30,
  height: 30,
}) {
  const photoUrlSelectorFunction = useSelector(organizationTokenPhotoUrlSelector);
  const [photoUrl, setPhotoTokenUrl] = useState(() => photoUrlSelectorFunction(identifier));
  const [tokenPhotoJSX, setTokenPhotoJSX] = useState(
    <img width={options.width} height={options.height} src={photoUrl} alt="token" className="mr-2" />,
  );

  useEffect(() => {
    setPhotoTokenUrl(photoUrlSelectorFunction(identifier));
  }, [photoUrlSelectorFunction, identifier]);

  useEffect(() => {
    setTokenPhotoJSX(
      <img width={options.width} height={options.height} src={photoUrl} alt="token" className="mr-2" />,
    );
  }, [options.height, options.width, photoUrl]);

  return { tokenPhotoJSX: photoUrl ? tokenPhotoJSX : <ElrondLogo className="mr-2" /> };
}
