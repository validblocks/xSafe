import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPhotoUrlById, accountSelector } from 'src/redux/selectors/accountSelector';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { MultiversXLogo } from './MultiversXLogo';

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
  const tokenPhotoByUrlSelector = useMemo(() => createDeepEqualSelector(accountSelector,
    (state: StateType) => getTokenPhotoUrlById(state, identifier)), [identifier]);
  const photoUrl = useSelector<StateType, string>(tokenPhotoByUrlSelector);

  if (identifier === 'EGLD') {
    return <MultiversXLogo />;
  }

  return <img width={options.width} height={options.height} src={photoUrl} alt="token" className="mr-2" />;
};
