import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { adjustTextByWidth } from 'src/utils/stringUtils';

interface IProps {
    value: string;
}

export const NftCollectionTitle = ({ value }: IProps) => {
  const typographyRef = useRef<HTMLDivElement>(null);
  const [adjustedText, setAdjustedText] = useState<string>(value);

  useEffect(() => {
    if (typographyRef.current) {
      setAdjustedText(adjustTextByWidth({
        text: value, containerWidth: typographyRef.current?.offsetWidth ?? 0, containerPadding2X: 10,
      }));
    }
  }, [value, typographyRef]);
  return (
    <Box sx={{ mt: 0.2, mb: 0.2, pl: 1 }}>
      <Typography
        ref={typographyRef}
        sx={{ whiteSpace: 'nowrap' }}
        className="font-weight-bold"
      >{adjustedText}
      </Typography>
    </Box>
  );
};
