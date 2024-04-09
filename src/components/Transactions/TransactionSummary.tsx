import dayjs from 'dayjs';
import { capitalizeString } from 'src/utils/stringUtils';
import { getDate } from 'src/utils/transactionUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useMediaQuery } from '@mui/material';
import { PairOfTransactionAndDecodedAction } from '../../pages/Transactions/TransactionHistory';
import * as Styled from '../../pages/Transactions/styled';
import ShortMemberPresentation from './ShortMemberPresentation';

function TransactionSummary({
  transaction,
  action,
}: PairOfTransactionAndDecodedAction) {
  const minWidth600 = useMediaQuery('(min-width: 600px)');
  return (
    <Styled.ActionSummaryContainer>
      <Styled.ActionIdBox>
        <Text>{action?.actionId}</Text>
      </Styled.ActionIdBox>

      <Styled.ActionTitleBox>
        <Text fontWeight={700}>{action?.title()}</Text>
      </Styled.ActionTitleBox>

      <Styled.ActionSignersBox>
        <div>
          {minWidth600 && (
            <strong>
              <Text fontSize={12} fontWeight={700}>
                Execution Time:
              </Text>
            </strong>
          )}
          <Text fontSize={12} fontWeight={minWidth600 ? 400 : 500}>
            {dayjs(getDate(transaction.timestamp)).format('H:mm A')}
          </Text>
        </div>
      </Styled.ActionSignersBox>

      <Styled.ActionCreatorBox>
        {minWidth600 && (
          <Text fontWeight={500} fontSize={14}>
            Created by:
          </Text>
        )}
        <ShortMemberPresentation address={transaction.sender} />
      </Styled.ActionCreatorBox>
      <Styled.ActionStatusBox>
        <div className="d-flex align-items-center justify-content-end">
          <Styled.SuccesContainerBox>
            {capitalizeString(transaction.status)}
          </Styled.SuccesContainerBox>
        </div>
      </Styled.ActionStatusBox>
    </Styled.ActionSummaryContainer>
  );
}

export default TransactionSummary;
