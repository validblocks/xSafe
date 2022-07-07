import { Ui } from '@elrondnetwork/dapp-utils';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { capitalizeString } from 'src/utils/stringUtils';
import { getDate } from 'src/utils/transactionUtils';
import { PairOfTransactionAndDecodedAction } from './TransactionHistory';

function TransactionSummary({
  transaction,
  action,
}: PairOfTransactionAndDecodedAction) {
  return (
    <>
      <Box className="d-flex">
        <Box
          className="d-flex align-items-center justify-content-center w-100"
          sx={{
            borderRight: '1px solid #D6DAF1',
            padding: '1rem',
            minWidth: '60px',
          }}
        >
          {action?.actionId}
        </Box>

        <Box
          className="d-flex align-items-center justify-content-start"
          sx={{
            borderRight: '1px solid #D6DAF1',
            padding: '1rem',
            fontWeight: 'bold',
            minWidth: '230px',
          }}
        >
          {action?.title()}
        </Box>

        <Box
          sx={{
            borderRight: '1px solid #D6DAF1',
            padding: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minWidth: '150px',
          }}
        >
          <div>
            <strong>Execution Time:</strong>
          </div>
          {dayjs(getDate(transaction.timestamp)).format('H:mm A')}
        </Box>

        <Box
          sx={{
            padding: '1rem',
            fontSize: '0.85rem',
            flex: 1,
          }}
        >
          <div>
            <strong>Executed by:</strong>
          </div>
          <div className="d-flex align-items-center mt-1">
            <img
              className="mr-2 rounded"
              src="https://picsum.photos/20/20?random=1"
              alt="sender"
            />
            <Ui.Trim text={transaction.sender} />
          </div>
        </Box>
      </Box>
      <Box
        className="d-flex align-items-center justify-content-center w-100"
        sx={{
          borderLeft: '1px solid #D6DAF1',
          padding: '1rem',
        }}
      >
        <div className="mx-3 d-flex align-items-center justify-content-end">
          <Box
            sx={{
              backgroundColor: '#3BE292',
              color: '#fff',
              borderRadius: '4px',
              padding: '0.5rem 0.675rem',
              fontWeight: 'bold',
            }}
          >
            {capitalizeString(transaction.status)}
          </Box>
        </div>
      </Box>
    </>
  );
}

export default TransactionSummary;
