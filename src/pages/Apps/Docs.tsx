import { ArrowDropDown } from '@mui/icons-material';
import { AccordionDetails, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { TransactionAccordion, TransactionAccordionSummary } from 'src/components/StyledComponents/transactions';
import { apps } from 'src/apps/apps';
import { useTranslation } from 'react-i18next';
import TransactionDescription from '../Transactions/TransactionDescription';
import TransactionSummary from '../Transactions/TransactionSummary';
import AppSelect from './AppSelect';
import NoActionsOverlay from '../Transactions/utils/NoActionsOverlay';

const useStyles = makeStyles(() => ({
  expanded: { margin: 0 },
  content: {
    margin: 0,
    display: 'flex',
    outline: 'none',
    justifyContent: 'space-between',
    '&$expanded': {
      margin: 0,
    },
  },
}));

export const Docs = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedApp, setSelectedApp] = useState(apps[apps.length - 1]);
  const { t } = useTranslation();
  const classes = useStyles();
  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const { transaction, action } = selectedApp;

  const hasTransaction = !!transaction;
  const hasAction = !!action;
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Text fontSize={15} fontWeight={600}>
          This is how a successful
        </Text>
        <Box mx={1}>
          <AppSelect selectedApp={selectedApp} setSelectedApp={setSelectedApp} apps={apps} />
        </Box>
        <Text fontSize={15} fontWeight={600}>
          proposal would look like:
        </Text>
      </Box>
      {hasTransaction && hasAction ? (
        <TransactionAccordion
          key={transaction.txHash}
          expanded={expanded === transaction.txHash}
          onChange={handleChange(transaction.txHash)}
        >
          <TransactionAccordionSummary
            expandIcon={(<ArrowDropDown />)}
            aria-controls="panel1a-content"
            className="pl-0 m-0 d-flex"
            classes={{
              content: classes.content,
              expanded: classes.expanded,
            }}
          >
            <TransactionSummary
              transaction={transaction}
              action={action}
            />
          </TransactionAccordionSummary>

          <AccordionDetails
            sx={{ padding: '0', border: 'none !important' }}
          >
            <TransactionDescription
              transaction={transaction}
              action={action}
              signers={action?.signers}
            />
          </AccordionDetails>
        </TransactionAccordion>
      ) : (
        <Box
          pt="14px"
          minWidth={'500px'}
        ><NoActionsOverlay message={t('No UI provided for the selected app')} />
        </Box>
      )}
    </Box>
  );
};

export default Docs;
