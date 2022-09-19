import React, { useMemo, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { makeStyles } from '@mui/styles';
import { useQuery, useQueryClient } from 'react-query';
import { TransactionAccordion } from 'src/components/StyledComponents/transactions';
import LoadingDataIndicator from 'src/components/Utils/LoadingDataIndicator';
import PaginationWithItemsPerPage from 'src/components/Utils/PaginationWithItemsPerPage';
import { queryAllActions } from 'src/contracts/MultisigContract';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import {
  transactionServices,
} from '@elrondnetwork/dapp-core';
import { currentMultisigTransactionIdSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import PendingActionSummary from './PendingActionSummary';
import TransactionActionsCard from './TransactionActionsCard';
import TransactionDescription from './TransactionDescription';

const useStyles = makeStyles(() => ({
  expanded: { margin: 0 },
  content: {
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',

    '&$expanded': {
      margin: 0,
    },
  },
}));

const TransactionQueue = () => {
  const classes = useStyles();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionsPerPage, setActionsPerPage] = useState(20);
  const [actionsForCurrentPage, setActionsForCurrentPage] = useState<
    MultisigActionDetailed[]
  >([]);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const {
    boardMembersState: [boardMembers],
  } = useOrganizationInfoContext();

  const queryClient = useQueryClient();

  const {
    data: allPendingActions,
    isLoading,
    isFetching,
    isError,
  } = useQuery(
    QueryKeys.ALL_PENDING_ACTIONS,
    () => queryAllActions().then((resp) => resp),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
    },
  );

  const reversedActions = useMemo(() => actionsForCurrentPage.slice().reverse(), [actionsForCurrentPage]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const currentMultisigTransactionId = useSelector(currentMultisigTransactionIdSelector);

  transactionServices.useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.ALL_PENDING_ACTIONS);
    },
  });

  if (isLoading || isFetching) {
    return <LoadingDataIndicator dataName="action" />;
  }

  if (isError || !allPendingActions) {
    return <div>Error while retrieving pending actions!</div>;
  }

  return (
    <>
      {reversedActions.map((action) => (
        <TransactionAccordion
          key={action.actionId}
          sx={{
            overflow: 'scroll',
          }}
          onChange={handleChange(action.actionId.toString())}
          expanded={expanded === action.actionId.toString()}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            sx={{
              borderRadius: '10px',
              border: 'none !important',
              outline: 'none !important',
            }}
            className="pl-0 m-0 d-flex"
            classes={{
              content: classes.content,
              expanded: classes.expanded,
            }}
            id="panel1a-header"
          >
            <PendingActionSummary action={action} />
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0' }}>
            <TransactionDescription
              boardMembers={boardMembers}
              action={action}
              signers={action.signers}
              description={action.description()}
              bottomLeftChild={(
                <TransactionActionsCard
                  boardMembers={boardMembers}
                  key={action.actionId}
                  type={action.typeNumber()}
                  actionId={action.actionId}
                  title={action.title()}
                  tooltip={action.tooltip()}
                  value={action.description()}
                  data={action.getData()}
                  action={action}
                  signers={action.signers}
                />
              )}
            />
          </AccordionDetails>
        </TransactionAccordion>
      ))}
      <PaginationWithItemsPerPage
        data={allPendingActions}
        setParentCurrentPage={setCurrentPage}
        setParentItemsPerPage={setActionsPerPage}
        setParentDataForCurrentPage={setActionsForCurrentPage}
        setParentTotalPages={setTotalPages}
        currentPage={currentPage}
        itemsPerPage={actionsPerPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default TransactionQueue;
