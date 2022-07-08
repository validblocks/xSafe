import { useCallback, useState } from 'react';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import CopyButton from 'src/components/CopyButton';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { network } from 'src/config';
import { getDate } from 'src/utils/transactionUtils';
import TransactionAdvancedDetails from './TransactionAdvancedDetails';

type Props = any;

function TransactionTechnicalDetails({ transaction }: Props) {
  const [isAdvancedDetailsVisibile, setIsAdvancedDetailsVisible] =
    useState(false);
  const toggleAdvancedDetails = useCallback(
    () => setIsAdvancedDetailsVisible((currentState) => !currentState),
    [],
  );

  return (
    <Box>
      <Typography component="div" variant="body1" className="my-1">
        <Typography
          component="span"
          className="mr-2"
          variant="body1"
          sx={{
            color: 'rgb(93, 109, 116)',
          }}
        >
          <strong>Transaction Hash:</strong>
        </Typography>
        {transaction?.txHash.slice(0, 15)}
        ...
        {transaction?.txHash.slice(transaction?.txHash.length - 15)}
        <CopyButton className="ml-2" text={transaction?.txHash} />
        <Anchor
          href={`${network.explorerAddress}/transactions/${transaction?.txHash}`}
          target="_blank"
          rel="noreferrer"
          color="#6c757d"
          className="ml-2"
        >
          <ContentPasteGoIcon />
        </Anchor>
      </Typography>

      <Typography component="div" className="my-1">
        <Typography
          component="span"
          className="mr-2"
          variant="body1"
          sx={{
            color: 'rgb(93, 109, 116)',
          }}
        >
          <strong>Timestamp: </strong>
        </Typography>
        {dayjs(getDate(transaction?.timestamp)).format('H:mm A')}
      </Typography>
      <Typography component="div" className="my-1">
        <Typography
          component="span"
          className="mr-2"
          variant="body1"
          sx={{
            color: 'rgb(93, 109, 116)',
          }}
        >
          <strong>Nonce: </strong>
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
          }}
        >
          <strong>Sender shard: </strong>
        </Typography>
        {transaction.senderShard}
      </Typography>
      <Typography component="div" className="my-1">
        <Typography
          component="span"
          className="mr-2"
          variant="body1"
          sx={{
            color: 'rgb(93, 109, 116)',
          }}
        >
          <strong>Receiver shard: </strong>
        </Typography>
        {transaction.receiverShard}
      </Typography>
      <Button
        variant="text"
        className="px-0"
        onClick={() => toggleAdvancedDetails()}
        sx={{
          color: 'rgb(93, 109, 116)',
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'underline',
            backgroundColor: 'transparent',
          },
        }}
      >
        Advanced details
      </Button>

      {isAdvancedDetailsVisibile && (
        <TransactionAdvancedDetails transaction={transaction} />
      )}
    </Box>
  );
}

export default TransactionTechnicalDetails;
