import { Typography } from '@mui/material';
import { Box } from '@mui/system';

type Props = any;

const TransactionAdvancedDetails = ({ transaction }: Props) => (
  <Box>
    <Typography component="div" variant="body1" className="my-1">
      <Typography
        component="span"
        className="mr-2"
        variant="body1"
        sx={{
          color: 'rgb(93, 109, 116)',
          letterSpacing: 0.5,
        }}
      >
        Mini Block Hash:
        {}
      </Typography>
      {transaction?.miniBlockHash.slice(0, 15)}
      ...
      {transaction?.miniBlockHash.slice(transaction?.miniBlockHash.length - 15)}
    </Typography>
    <Typography component="div" className="my-1">
      <Typography
        component="span"
        className="mr-2"
        variant="body1"
        sx={{
          color: 'rgb(93, 109, 116)',
          letterSpacing: 0.5,
        }}
      >
        Nonce:
      </Typography>
      {transaction?.nonce}
    </Typography>
    <Typography component="div" className="my-1">
      <Typography
        component="span"
        className="mr-2"
        variant="body1"
        sx={{
          color: 'rgb(93, 109, 116)',
          letterSpacing: 0.5,
        }}
      >
        Gas Price:
      </Typography>
      {transaction?.gasPrice}
    </Typography>
    <Typography component="div" className="my-1">
      <Typography
        component="span"
        className="mr-2"
        variant="body1"
        sx={{
          color: 'rgb(93, 109, 116)',
          letterSpacing: 0.5,
        }}
      >
        Gas Used:
      </Typography>
      {transaction?.gasUsed}
    </Typography>
  </Box>
);

export default TransactionAdvancedDetails;
