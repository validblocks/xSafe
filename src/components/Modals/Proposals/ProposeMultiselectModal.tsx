import { useCallback, useEffect, useState } from 'react';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useDispatch } from 'react-redux';
import {
  mutateSendEgld,
  mutateSmartContractCall,
  mutateDeployContractFromSource,
  mutateUpgradeContractFromSource,
  mutateEsdtIssueToken,
  mutateEsdtSendToken,
  mutateEsdtSendNft,
  mutateEsdtSendSft,
} from 'src/contracts/MultisigContract';
import {
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend,
} from 'src/redux/slices/modalsSlice';
import { MultisigAction } from 'src/types/multisig/MultisigAction';
import { MultisigDeployContractFromSource } from 'src/types/multisig/proposals/MultisigDeployContractFromSource';
import { MultisigIssueToken } from 'src/types/multisig/proposals/MultisigIssueToken';
import { MultisigSendEgld } from 'src/types/multisig/proposals/MultisigSendEgld';
import { MultisigSendToken } from 'src/types/multisig/proposals/MultisigSendToken';
import { MultisigSendNft } from 'src/types/multisig/proposals/MultisigSendNft';
import { MultisigSmartContractCall } from 'src/types/multisig/proposals/MultisigSmartContractCall';
import { MultisigUpgradeContractFromSource } from 'src/types/multisig/proposals/MultisigUpgradeContractFromSource';
import {
  ProposalsTypes,
  SelectedOptionType,
} from 'src/types/multisig/proposals/Proposals';
import ModalCardTitle from 'src/components/Layout/Modal/ModalCardTitle';
import {
  MainButton,
  ModalContainer,
} from 'src/components/Theme/StyledComponents';
import { Box, useMediaQuery } from '@mui/material';
import { MultisigSendSft } from 'src/types/multisig/proposals/MultisigSendSft';
import { titles } from '../../MultisigDetails/constants';
import AttachContractContent from '../../MultisigDetails/ProposeMultiselectModal/AttachContractContent';
import ProposeDeployContractFromSource from './ProposeDeployContractFromSource';
import ProposeIssueToken from './ProposeIssueToken';
import ProposeSendEgld from './ProposeSendEgld';
import ProposeSendToken from './ProposeSendToken';

import ProposeSmartContractCall from './ProposeSmartContractCall';
import ProposeUpgradeContractFromSource from './ProposeUpgradeContractFromSource';

import '../../MultisigDetails/ProposeMultiselectModal/proposeMultiselectModal.scss';
import ProposeSendNft from './ProposeSendNft';
import StakeTokensModalContent from '../../MultisigDetails/ProposeMultiselectModal/StakeTokensModalContent';
import ProposeUnstakeTokens from './ProposeUnstakeTokens';
import ProposeWithdrawFunds from './ProposeWithdrawFunds';
import ProposeSendSft from './ProposeSendSft';

interface ProposeMultiselectModalPropsType {
  selectedOption: SelectedOptionType;
}

const MultiStepProposals = [
  ProposalsTypes.stake_tokens,
  ProposalsTypes.withdraw_funds,
];

const ProposeMultiselectModal = ({
  selectedOption,
}: ProposeMultiselectModalPropsType) => {
  const dispatch = useDispatch();
  const t = useCustomTranslation();
  const [selectedProposal, setSelectedProposal] =
    useState<MultisigAction | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [isMultiStep, setIsMultiStep] = useState(
    MultiStepProposals.includes(
      selectedOption?.option ?? ('' as ProposalsTypes),
    ),
  );

  const [activeStepNumber, setActiveStepNumber] = useState(1);
  const [totalSteps, setTotalSteps] = useState(0);

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const [isAtFinish, setIsAtFinish] = useState(!isMultiStep);

  useEffect(() => {
    setIsMultiStep(
      MultiStepProposals.includes(
        selectedOption?.option ?? ('' as ProposalsTypes),
      ),
    );
  }, [selectedOption?.option, isAtFinish]);

  const handleClose = () => {
    dispatch(setProposeMultiselectSelectedOption(null));
    dispatch(setSelectedTokenToSend(null));
  };

  const onProposeClicked = () => {
    try {
      if (selectedProposal instanceof MultisigSendEgld) {
        mutateSendEgld(
          selectedProposal.address,
          selectedProposal.amount,
          selectedProposal.functionName,
          ...selectedProposal.args,
        );
      } else if (selectedProposal instanceof MultisigSmartContractCall) {
        mutateSmartContractCall(
          selectedProposal.address,
          selectedProposal.amount,
          selectedProposal.functionName,
          ...selectedProposal.args,
        );
      } else if (selectedProposal instanceof MultisigIssueToken) {
        mutateEsdtIssueToken(selectedProposal as MultisigIssueToken);
      } else if (selectedProposal instanceof MultisigSendToken) {
        mutateEsdtSendToken(selectedProposal as MultisigSendToken);
      } else if (selectedProposal instanceof MultisigSendNft) {
        mutateEsdtSendNft(selectedProposal as MultisigSendNft);
      } else if (selectedProposal instanceof MultisigSendSft) {
        mutateEsdtSendSft(selectedProposal as MultisigSendSft);
      } else if (selectedProposal instanceof MultisigDeployContractFromSource) {
        mutateDeployContractFromSource(
          selectedProposal.amount,
          selectedProposal.source,
          selectedProposal.upgradeable,
          selectedProposal.payable,
          selectedProposal.readable,
          ...selectedProposal.args,
        );
      } else if (
        selectedProposal instanceof MultisigUpgradeContractFromSource
      ) {
        mutateUpgradeContractFromSource(
          selectedProposal.address,
          selectedProposal.amount,
          // selectedProposal.source,
          selectedProposal.upgradeable,
          selectedProposal.payable,
          selectedProposal.readable,
          ...selectedProposal.args,
        );
      }
      handleClose();
    } catch (err) {
      handleClose();
    }
  };

  const handleProposalChange = useCallback((proposal: MultisigAction) => {
    setSelectedProposal(proposal);
  }, []);

  const getContent = () => {
    switch (selectedOption?.option) {
      case ProposalsTypes.send_egld:
        return (
          <ProposeSendEgld
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      case ProposalsTypes.smart_contract_call:
        return (
          <ProposeSmartContractCall
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      case ProposalsTypes.issue_token:
        return (
          <ProposeIssueToken
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      case ProposalsTypes.send_token: {
        return (
          <ProposeSendToken
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      }
      case ProposalsTypes.send_nft: {
        return (
          <ProposeSendNft
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      }
      case ProposalsTypes.send_sft: {
        return (
          <ProposeSendSft
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      }
      case ProposalsTypes.deploy_contract_from_source:
        return (
          <ProposeDeployContractFromSource
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      case ProposalsTypes.upgrade_contract_from_source:
        return (
          <ProposeUpgradeContractFromSource
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      case ProposalsTypes.stake_tokens: {
        return (
          <StakeTokensModalContent
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
            setIsAtFinish={setIsAtFinish}
            stepChanged={setActiveStepNumber}
            announceTotalSteps={setTotalSteps}
          />
        );
      }
      case ProposalsTypes.unstake_tokens: {
        return (
          <ProposeUnstakeTokens
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      }
      case ProposalsTypes.withdraw_funds: {
        return (
          <ProposeWithdrawFunds
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
            setIsAtFinish={setIsAtFinish}
            stepChanged={setActiveStepNumber}
            announceTotalSteps={setTotalSteps}
          />
        );
      }
      default:
        return <div />;
    }
  };

  const sendNFTButton = (
    <MainButton
      disabled={submitDisabled}
      onClick={onProposeClicked}
      onKeyDown={(e) => e.preventDefault()}
      onKeyUp={(e) => e.preventDefault()}
      sx={{ boxShadow: 'none !important', width: '100%' }}
    >
      {t('Create proposal')}
    </MainButton>
  );

  const actionTitle =
    selectedOption?.option != null ? `${titles[selectedOption?.option]}` : '';

  const isAttachContractAction =
    selectedOption?.option === ProposalsTypes.attach_contract;

  const modalContent = isAttachContractAction ? (
    <AttachContractContent handleClose={handleClose} />
  ) : (
    <div className="card overflow-hidden">
      <ModalCardTitle
        activeStepNumber={activeStepNumber}
        totalSteps={totalSteps}
        title={actionTitle}
        handleClose={handleClose}
      />
      <div>
        {getContent()}
        {!isMultiStep && (
          <Box
            display={'flex'}
            justifyContent={'center'}
            padding={maxWidth600 ? '0 16px 16px' : '0 40px 32px'}
          >
            {selectedOption?.option !==
              ProposalsTypes.multiselect_proposal_options && sendNFTButton}
          </Box>
        )}
      </div>
    </div>
  );

  return (
    <ModalContainer
      show
      size="lg"
      onHide={handleClose}
      className="modal-container proposal-modal"
      animation
      centered
    >
      {modalContent}
    </ModalContainer>
  );
};

export default ProposeMultiselectModal;
