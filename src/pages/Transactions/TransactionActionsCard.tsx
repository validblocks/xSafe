/* eslint-disable react/no-unused-prop-types */
import { Address } from '@elrondnetwork/erdjs/out';
import { gasLimit as defaultGasLimit } from 'src/config';
import { Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  mutateSign,
  mutateUnsign,
  mutateDiscardAction,
  mutatePerformAction,
} from 'src/contracts/MultisigContract';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { DiscardActionButton, PerformActionButton, Text } from 'src/components/StyledComponents/StyledComponents';
import { gasLimits } from 'src/components/PerformActionModal';
import { setIntervalEndTimestamp } from 'src/redux/slices/transactionsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { currentMultisigTransactionIdSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useTrackTransactionStatus } from '@elrondnetwork/dapp-core/hooks';
import { useState } from 'react';
import useTransactionPermissions from './useTransactionPermissions';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';

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
  action,
}: TransactionActionsCardType) {
  const { t } = useTranslation();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const { canUnsign, canPerformAction, canSign, canDiscardAction } =
    useTransactionPermissions(action);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const sign = () => {
    setIsLoading(true);
    mutateSign(actionId);
  };
  const unsign = () => {
    setIsLoading(true);
    mutateUnsign(actionId);
  };
  const performAction = async () => {
    setIsLoading(true);
    const gasLimit = type != null
      ? gasLimits[type as keyof typeof gasLimits] ?? defaultGasLimit
      : defaultGasLimit;
    mutatePerformAction(actionId, gasLimit).then(() => {
      dispatch(setIntervalEndTimestamp(new Date().getTime() / 1000));
    });
  };
  const discardAction = () => {
    setIsLoading(true);
    mutateDiscardAction(actionId);
  };

  const currentMultisigTransactionId = useSelector(currentMultisigTransactionIdSelector);
  useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onSuccess: () => {
      if (isLoading) setIsLoading(false);
    },
    onCancelled: () => {
      if (isLoading) setIsLoading(false);
    },
    onFail: () => {
      if (isLoading) setIsLoading(false);
    },
    onTimedOut: () => {
      if (isLoading) setIsLoading(false);
    },
  });

  const maxWidth600 = useMediaQuery('@media(max-width:600px)');

  if (isInReadOnlyMode) {
    return <Text>Actions are not allowed in Read-Only Mode.</Text>;
  }

  if (!canSign && !canUnsign && !canPerformAction && !canDiscardAction) {
    return <Text>You are not allowed to make changes on this action.</Text>;
  }

  return (
    <>
      <Typography variant="h6" color="black">
        <Text fontSize={maxWidth600 ? 14 : 17}><strong>Available Actions</strong></Text>
      </Typography>
      <div className="text-black py-3">
        <div className="d-flex">
          <div className="d-flex btns action-btns">
            {canSign && (
              <PerformActionButton
                disabled={isLoading}
                size="large"
                onClick={sign}
              >
                {t('Approve') as string}
              </PerformActionButton>
            )}
            {canUnsign && (
            <DiscardActionButton disabled={isLoading} size="large" onClick={unsign}>
              {t('Discard') as string}
            </DiscardActionButton>
            )}
            {canPerformAction && (
              <PerformActionButton
                disabled={isLoading}
                size="large"
                onClick={performAction}
              >
                {t('Perform') as string}
              </PerformActionButton>
            )}
            {canDiscardAction && (
              <DiscardActionButton disabled={isLoading} size="large" onClick={discardAction}>
                {t('Discard') as string}
              </DiscardActionButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default TransactionActionsCard;
