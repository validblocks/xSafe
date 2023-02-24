import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPhotoUrlById, accountSelector } from 'src/redux/selectors/accountSelector';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { Box } from '@mui/material';
import { MultiversXLogo } from './MultiversXLogo';

interface ITokenPhotoOptions {
    width?: number;
  height?: number;
  logoMarginRight?: string;
}

interface Props {
    identifier: string;
    options?: ITokenPhotoOptions
}

export const TokenPhoto = ({
  identifier,
  options = {
    width: 30,
    height: 30,
    logoMarginRight: '14px',
  },
}: Props) => {
  const tokenPhotoByUrlSelector = useMemo(() => createDeepEqualSelector(accountSelector,
    (state: StateType) => getTokenPhotoUrlById(state, identifier)), [identifier]);
  const photoUrl = useSelector<StateType, string>(tokenPhotoByUrlSelector);

  if (identifier === 'EGLD') {
    return (
      <MultiversXLogo
        width={options.width}
        height={options.height}
        marginRight={options.logoMarginRight}
      />
    );
  }

  return (
    <Box marginRight={options.logoMarginRight}>
      <img
        width={options.width}
        height={options.height}
        src={photoUrl}
        alt="token"
        className="mr-2"
      />
    </Box>
  );
};
