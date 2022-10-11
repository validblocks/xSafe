import { Box } from '@mui/system';

interface IProps {
    value: string;
}

export const NftCollectionTitle = ({ value }: IProps) => {
  const nftCategoryLetters = value.slice(0, value.indexOf('-'));
  const nftCategoryDigits = `(${value.slice(value.indexOf('-') + 1, value.length)})`;
  return (
    <Box sx={{ mt: 0.2, mb: 0.2, pl: 1 }}>
      <span className="font-weight-bold">{nftCategoryLetters}</span>
      <span className="collectionLight">{nftCategoryDigits}</span>
    </Box>
  );
};
