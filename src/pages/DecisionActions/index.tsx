import React from 'react';
import { Box } from '@mui/material';
import ActionBoxDetails from 'components/DecisionActionsComponents/ActionBoxDetails';
import DecisionsActionsHeader from 'components/DecisionActionsComponents/decisionsActionsHeader';
import './decision-actions.scss';

const DecisionActions = () => (
  <Box className="flex-fill justify-content-center align-items-center flex-column decision-actions-wrapper">
    <DecisionsActionsHeader />
    <ActionBoxDetails />
  </Box>
);

export default DecisionActions;
