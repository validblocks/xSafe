import { Ui } from '@elrondnetwork/dapp-utils';
import dayjs from 'dayjs';
import { toSvg } from 'jdenticon';
import { capitalizeString } from 'src/utils/stringUtils';
import { getDate } from 'src/utils/transactionUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useTheme } from 'styled-components';
import { PairOfTransactionAndDecodedAction } from './TransactionHistory';
import * as Styled from './styled';

function TransactionSummary({
  transaction,
  action,
}: PairOfTransactionAndDecodedAction) {
  const theme: any = useTheme();
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
          <strong><Text fontSize={12} fontWeight={700}>Execution Time:</Text></strong>
          <Text fontSize={12}>{dayjs(getDate(transaction.timestamp)).format('H:mm A')}</Text>
        </div>
      </Styled.ActionSignersBox>

      <Styled.ActionCreatorBox>
        <Text fontSize={12} fontWeight={700}><strong>Executed by:</strong></Text>
        <div>
          <div
            className="mr-1"
            dangerouslySetInnerHTML={{ __html: toSvg(transaction.sender, 20) }}
          />
          <Text fontSize={12}><Ui.Trim text={transaction.sender} /></Text>
        </div>
      </Styled.ActionCreatorBox>
      <Styled.ActionStatusBox>
        <div className="mx-2 d-flex align-items-center justify-content-end">
          <Styled.SuccesContainerBox>
            <Text sx={{
              color: `${theme.palette.text.success} !important`,
              fontWeight: '700',
            }}
            >{capitalizeString(transaction.status)}
            </Text>
          </Styled.SuccesContainerBox>
        </div>
      </Styled.ActionStatusBox>
    </Styled.ActionSummaryContainer>
  );
}

export default TransactionSummary;
