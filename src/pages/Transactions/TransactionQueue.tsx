import React, { useMemo, useState } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { makeStyles } from '@mui/styles';
import { useQueryClient } from 'react-query';
import { TransactionAccordion } from 'src/components/StyledComponents/transactions';
import PaginationWithItemsPerPage from 'src/components/Utils/PaginationWithItemsPerPage';
import { useOrganizationInfoContext } from 'src/components/Providers/OrganizationInfoContextProvider';
import { QueryKeys } from 'src/react-query/queryKeys';
import { MultisigActionDetailed } from 'src/types/multisig/MultisigActionDetailed';
import {
  currentMultisigContractSelector,
  currentMultisigTransactionIdSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import { ArrowDropDown } from '@mui/icons-material';
import { useTrackTransactionStatus } from 'src/hooks/sdkDappHooks';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { usePendingActions } from 'src/hooks/usePendingActions';
import LoadingDataIndicator from 'src/components/Utils/LoadingDataIndicator';
import { Box, useMediaQuery } from '@mui/material';
import PendingActionSummary from '../../components/Transactions/PendingActionSummary';
import TransactionActionsCard from '../../components/Transactions/TransactionActionsCard';
import TransactionDescription from '../../components/Transactions/TransactionDescription';
import NoActionsOverlay from '../../components/Utils/NoActionsOverlay';
import { motion } from 'framer-motion';

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
  const t = useCustomTranslation();

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const {
    boardMembersState: [boardMembers],
  } = useOrganizationInfoContext();

  const queryClient = useQueryClient();
  // const allPendingActions = queryClient.getQueryData(QueryKeys.ALL_PENDING_ACTIONS) as any[];
  const { allPendingActions } = usePendingActions();

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const currentMultisigTransactionId = useSelector(
    currentMultisigTransactionIdSelector,
  );
  const currentContract = useSelector(currentMultisigContractSelector);

  const untruncatedData = useMemo(
    () => allPendingActions?.slice().reverse() ?? [],
    [allPendingActions],
  );

  useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.ALL_PENDING_ACTIONS);
    },
  });

  if (!currentContract?.address) {
    return (
      <Box pt={maxWidth600 ? '45px' : '12px'}>
        <NoActionsOverlay message={t('No safe available')} />
      </Box>
    );
  }

  if (!allPendingActions) {
    return (
      <Box marginTop={maxWidth600 ? '60px' : 0}>
        <LoadingDataIndicator dataName="proposal" />
      </Box>
    );
  }

  if (allPendingActions.length === 0) {
    return (
      <Box pt={maxWidth600 ? '45px' : '12px'}>
        <NoActionsOverlay message={t('No transactions found')} />
      </Box>
    );
  }

  return (
    <Box
      paddingTop={maxWidth600 ? '37px' : 0}
      paddingBottom={maxWidth600 ? '52px' : 0}
    >
      {actionsForCurrentPage.map((action, idx) => (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            delay: 0.035 * idx,
          }}
          viewport={{ once: true }}
          exit={{ opacity: 0, scale: 0 }}
          key={action.actionId}
        >
          <TransactionAccordion
            key={action.actionId}
            onChange={handleChange(action.actionId.toString())}
            expanded={expanded === action.actionId.toString()}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDown sx={{ '& svg': { fill: 'red' } }} />}
              aria-controls="panel1a-content"
              className="pl-0 m-0"
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
                bottomLeftChild={
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
                }
              />
            </AccordionDetails>
          </TransactionAccordion>
        </motion.div>
      ))}
      <PaginationWithItemsPerPage
        data={untruncatedData}
        setParentCurrentPage={setCurrentPage}
        setParentItemsPerPage={setActionsPerPage}
        setParentDataForCurrentPage={setActionsForCurrentPage}
        setParentTotalPages={setTotalPages}
        currentPage={currentPage}
        itemsPerPage={actionsPerPage}
        totalPages={totalPages}
      />
    </Box>
  );
};

export default TransactionQueue;
