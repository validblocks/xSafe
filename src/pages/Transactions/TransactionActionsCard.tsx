import React from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import {
  faTimes,
  faThumbsUp,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  mutateSign,
  mutateUnsign,
  mutateDiscardAction
} from 'contracts/MultisigContract';
import { setSelectedPerformedAction } from 'redux/slices/modalsSlice';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import useTransactionPermissions from './useTransactionPermissions';

export interface TransactionActionsCardType {
  type: number;
  actionId?: number;
  tooltip?: string;
  title?: string;
  value?: string;
  canSign?: boolean;
  canUnsign?: boolean;
  canPerformAction?: boolean;
  canDiscardAction?: boolean;
  data?: string;
  signers: Address[];
  boardMembers?: Address[];
  action: MultisigActionDetailed;
}

function TransactionActionsCard({
  type = 0,
  actionId = 0,
  action
}: // canSign = false,
// canUnsign = false,
// canPerformAction = false,
// canDiscardAction = false
TransactionActionsCardType) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { canUnsign, canPerformAction, canSign, canDiscardAction } =
    useTransactionPermissions(action);

  const sign = () => {
    mutateSign(actionId);
  };

  const unsign = () => {
    mutateUnsign(actionId);
  };

  const performAction = () => {
    dispatch(setSelectedPerformedAction({ id: actionId, actionType: type }));
  };

  const discardAction = () => {
    mutateDiscardAction(actionId);
  };

  if (!canSign && !canUnsign && !canPerformAction && !canDiscardAction) {
    return <div>You are not allowed to make changes on this action.</div>;
  }
  return (
    <>
      <Typography variant='h6' color='black'>
        <strong>Available Actions</strong>
      </Typography>
      <div className='text-black py-3'>
        <div className='d-flex'>
          <div className='d-flex btns action-btns'>
            {canSign && (
              <button onClick={sign} className='btn action sign btn--approve'>
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>{t('Approve')} </span>
              </button>
            )}
            {canUnsign && (
              <button
                onClick={unsign}
                className='btn  action unsign btn--discard'
              >
                <FontAwesomeIcon icon={faTimes} />
                <span>{t('Withdraw')}</span>
              </button>
            )}
            {canPerformAction && (
              <button
                style={{ whiteSpace: 'nowrap' }}
                onClick={performAction}
                className='btn action perform btn--approve'
              >
                <FontAwesomeIcon icon={faCheck} />
                {t('Perform')}
              </button>
            )}
            {canDiscardAction && (
              <button
                style={{ whiteSpace: 'nowrap' }}
                onClick={discardAction}
                className='btn action remove btn--discard'
              >
                <FontAwesomeIcon icon={faTimes} />
                {t('Discard')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionActionsCard;
