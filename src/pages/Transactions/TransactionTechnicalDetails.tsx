import { useCallback, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import CopyButton from 'src/components/CopyButton';
import { AnchorPurple } from 'src/components/Layout/Navbar/navbar-style';
import { network } from 'src/config';
import { getDate } from 'src/utils/transactionUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import TransactionAdvancedDetails from './TransactionAdvancedDetails';
import * as Styled from '../../components/Utils/styled/index';

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
        <Text display={'inline-block'}>{transaction?.txHash.slice(0, 15)}
          ...
          {transaction?.txHash.slice(transaction?.txHash.length - 15)}
        </Text>
        <CopyButton className="ml-2" text={transaction?.txHash} link={Styled.CopyIconLinkPurple} />
        <AnchorPurple
          href={`${network.explorerAddress}/transactions/${transaction?.txHash}`}
          target="_blank"
          rel="noreferrer"
          className="ml-2"
        >
          <SearchIcon />
        </AnchorPurple>
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
        <Text display={'inline-block'}>{dayjs(getDate(transaction?.timestamp)).format('H:mm A')}</Text>
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
        <Text display={'inline-block'}>{transaction?.nonce}</Text>
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
        <Text display={'inline-block'}>{transaction.senderShard}</Text>
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
        <Text display={'inline-block'}>{transaction.receiverShard}</Text>
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
