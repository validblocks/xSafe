import { useState } from 'react';
import { faHandPaper, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  mutateSendEgld,
  mutateSmartContractCall,
  mutateDeployContractFromSource,
  mutateUpgradeContractFromSource,
  mutateEsdtIssueToken,
  mutateEsdtSendToken,
} from 'src/contracts/MultisigContract';
import * as modalsSlice from 'src/redux/slices/modalsSlice';
import { MultisigAction } from 'src/types/MultisigAction';
import { MultisigDeployContractFromSource } from 'src/types/MultisigDeployContractFromSource';
import { MultisigIssueToken } from 'src/types/MultisigIssueToken';
import { MultisigSendEgld } from 'src/types/MultisigSendEgld';
import { MultisigSendToken } from 'src/types/MultisigSendToken';

import { MultisigSmartContractCall } from 'src/types/MultisigSmartContractCall';
import { MultisigUpgradeContractFromSource } from 'src/types/MultisigUpgradeContractFromSource';
import { ProposalsTypes, SelectedOptionType } from 'src/types/Proposals';
import { titles } from '../constants';
import AttachContractContent from './AttachContractContent';
import ProposeDeployContractFromSource from './ProposeDeployContractFromSource';
import ProposeIssueToken from './ProposeIssueToken';
import ProposeSendEgld from './ProposeSendEgld';
import ProposeSendToken from './ProposeSendToken';

import ProposeSmartContractCall from './ProposeSmartContractCall';
import ProposeUpgradeContractFromSource from './ProposeUpgradeContractFromSource';
import SelectOption from './SelectOption';

import './proposeMultiselectModal.scss';
import ProposeSendNft from './ProposeSendNft';
import { MultisigSendNft } from 'src/types/MultisigSendNft';

interface ProposeMultiselectModalPropsType {
  selectedOption: SelectedOptionType;
}

const ProposeMultiselectModal = ({
  selectedOption,
}: ProposeMultiselectModalPropsType) => {
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();
  const [selectedProposal, setSelectedProposal] =
    useState<MultisigAction | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleClose = () => {
    dispatch(modalsSlice.setProposeMultiselectSelectedOption(null));
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
          selectedProposal.source,
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
  const handleProposalChange = (proposal: MultisigAction) => {
    setSelectedProposal(proposal);
  };

  const handleOptionSelected = (option: ProposalsTypes) => {
    dispatch(modalsSlice.setProposeMultiselectSelectedOption({ option }));
  };

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
      default:
        return <SelectOption onSelected={handleOptionSelected} />;
    }
  };

  const proposeButton = (
    <button
      disabled={submitDisabled}
      onClick={onProposeClicked}
      className="btn btn-primary "
    >
      <FontAwesomeIcon icon={faHandPaper} />
      {t('Propose')}
    </button>
  );

  const closeButton = (
    <button onClick={handleClose} className="btn btn-primary btn-light ">
      <FontAwesomeIcon icon={faTimes} />
      {t('Cancel')}
    </button>
  );
  const cancelButton = closeButton;

  const actionTitle =
    selectedOption?.option != null ? `: ${titles[selectedOption?.option]}` : '';

  const isAttachContractAction =
    selectedOption?.option === ProposalsTypes.attach_contract;

  const modalContent = isAttachContractAction ? (
    <AttachContractContent handleClose={handleClose} />
  ) : (
    <div className="card">
      <div className="card-body">
        <p className="h3 mb-spacer text-center" data-testid="delegateTitle">
          {`${t('Make a proposal')}${actionTitle}`}
        </p>

        {getContent()}
        <div className="modal-action-btns">
          {cancelButton}

          {selectedOption?.option !==
            ProposalsTypes.multiselect_proposal_options && proposeButton}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      backdrop="static"
      show
      size="lg"
      onHide={handleClose}
      className="modal-container proposal-modal"
      animation={false}
      centered
    >
      {modalContent}
    </Modal>
  );
};

export default ProposeMultiselectModal;
