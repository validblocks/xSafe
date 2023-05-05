import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ImageIcon from 'src/assets/img/ImageIcon.svg';
import ImageIconActive from 'src/assets/img/ImageIconActive.svg';
import ImageWithDetailsIconActive from 'src/assets/img/ImageWithDetailsIconActive.svg';
import ImageWithDetailsIcon from 'src/assets/img/ImageWithDetailsIcon.svg';
import GridIcon from './GridIcon';

interface Props {
  setAreNftDetailsEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

export const CardDetailsViewSelection = ({ setAreNftDetailsEnabled }: Props) => {
  const [isSimplePhoto, setIsSimplePhoto] = useState(true);
  const simplePhotoClick = useCallback(() => {
    if (!isSimplePhoto) setIsSimplePhoto(true);
  }, [isSimplePhoto]);

  const photoWithDetailsClick = useCallback(() => {
    if (isSimplePhoto) setIsSimplePhoto(false);
  }, [isSimplePhoto]);

  useEffect(() => {
    setAreNftDetailsEnabled(!isSimplePhoto);
  }, [isSimplePhoto, setAreNftDetailsEnabled]);

  return (
    <>
      <Box onClick={simplePhotoClick}>
        <GridIcon svgUrl={isSimplePhoto ? ImageIconActive : ImageIcon} />
      </Box>
      <Box onClick={photoWithDetailsClick}>
        <GridIcon svgUrl={!isSimplePhoto ? ImageWithDetailsIconActive : ImageWithDetailsIcon} />
      </Box>
    </>
  );
};

export default CardDetailsViewSelection;
