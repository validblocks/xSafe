import { Ui } from '@elrondnetwork/dapp-utils';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { toSvg } from 'jdenticon';
import { capitalizeString } from 'src/utils/stringUtils';
import { getDate } from 'src/utils/transactionUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useTheme } from 'styled-components';
import { PairOfTransactionAndDecodedAction } from './TransactionHistory';

function TransactionSummary({
  transaction,
  action,
}: PairOfTransactionAndDecodedAction) {
  const theme: any = useTheme();
  return (
    <>
      <Box className="d-flex">
        <Box
          className="d-flex align-items-center justify-content-center w-100"
          sx={{
            borderRight: `1px solid ${theme.palette.divider.secondary}`,
            padding: '1rem',
            minWidth: '60px',
          }}
        >
          <Text>{action?.actionId}</Text>
        </Box>

        <Box
          className="d-flex align-items-center justify-content-start"
          sx={{
            borderRight: `1px solid ${theme.palette.divider.secondary}`,
            padding: '1rem',
            fontWeight: 'bold',
            minWidth: '230px',
          }}
        >
          <Text>{action?.title()}</Text>
        </Box>

        <Box
          sx={{
            borderRight: `1px solid ${theme.palette.divider.secondary}`,
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
            <strong><Text>Execution Time:</Text></strong>
          </div>
          <Text>{dayjs(getDate(transaction.timestamp)).format('H:mm A')}</Text>
        </Box>

        <Box
          sx={{
            padding: '1rem',
            fontSize: '0.85rem',
            flex: 1,
          }}
        >
          <div>
            <Text><strong>Executed by:</strong></Text>
          </div>
          <div className="d-flex align-items-center mt-1">
            <div
              className="mr-1"
              dangerouslySetInnerHTML={{ __html: toSvg(transaction.sender, 20) }}
            />
            <Text fontSize={12}><Ui.Trim text={transaction.sender} /></Text>
          </div>
        </Box>
      </Box>
      <Box
        className="d-flex align-items-center justify-content-center w-100"
        sx={{
          borderLeft: `1px solid ${theme.palette.divider.secondary}`,
          padding: '1rem',
        }}
      >
        <div className="mx-3 d-flex align-items-center justify-content-end">
          <Box
            sx={{
              backgroundColor: theme.palette.button.success,
              color: '#fff',
              borderRadius: '4px',
              padding: '0.5rem 0.675rem',
              fontWeight: 'bold',
            }}
          >
            <Text sx={{ color: `${theme.palette.text.success} !important`, fontWeight: '500' }}>{capitalizeString(transaction.status)}</Text>
          </Box>
        </div>
      </Box>
    </>
  );
}

export default TransactionSummary;
