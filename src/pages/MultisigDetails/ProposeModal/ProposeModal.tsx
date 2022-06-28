import React, { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { faHandPaper, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  mutateProposeChangeQuorum,
  mutateProposeAddProposer,
  mutateProposeAddBoardMember,
  mutateProposeRemoveUser
} from 'contracts/MultisigContract';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes, SelectedOptionType } from 'types/Proposals';
import { titles } from '../constants';
import ProposeChangeQuorum from './ProposeChangeQuorum';
import ProposeInputAddress from './ProposeInputAddress';
import ProposeRemoveUser from './ProposeRemoveUser';

interface ProposeModalPropsType {
  selectedOption: SelectedOptionType;
}

function ProposeModal({ selectedOption }: ProposeModalPropsType) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [selectedNumericParam, setSelectedNumericParam] = useState(1);
  const [selectedAddressParam, setSelectedAddressParam] = useState(
    new Address()
  );

  const onProposeClicked = () => {
    try {
      switch (selectedOption?.option) {
        case ProposalsTypes.change_quorum:
          mutateProposeChangeQuorum(selectedNumericParam);
          break;
        case ProposalsTypes.add_proposer:
          mutateProposeAddProposer(selectedAddressParam);
          break;
        case ProposalsTypes.add_board_member:
          mutateProposeAddBoardMember(selectedAddressParam);
          break;
        case ProposalsTypes.remove_user:
          mutateProposeRemoveUser(selectedAddressParam);
          break;
        default:
          console.error(`Unrecognized option ${selectedOption}`);
          break;
      }
      handleClose();
    } catch (err) {}
  };

  const handleNumericParamChange = (value: number) => {
    setSelectedNumericParam(value);
  };

  const handleAddressParamChange = (value: Address) => {
    setSelectedAddressParam(value);
  };

  const handleClose = () => {
    dispatch(setProposeModalSelectedOption(null));
  };
  if (selectedOption == null) {
    return null;
  }

  const getModalContent = () => {
    switch (selectedOption?.option) {
      case ProposalsTypes.change_quorum: {
        return (
          <ProposeChangeQuorum
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={handleNumericParamChange}
          />
        );
      }
      case ProposalsTypes.add_proposer:
      case ProposalsTypes.add_board_member:
        return (
          <ProposeInputAddress
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={handleAddressParamChange}
          />
        );
      case ProposalsTypes.remove_user:
        return (
          <ProposeRemoveUser
            handleSetAddress={handleAddressParamChange}
            selectedOption={selectedOption}
          />
        );
    }
  };

  const actionTitle =
    selectedOption?.option != null ? `: ${titles[selectedOption?.option]}` : '';
  return (
    <Modal
      show
      size='lg'
      onHide={handleClose}
      className='modal-container proposal-modal'
      animation={false}
      centered
    >
      <div className='card'>
        <div className='card-body'>
          <p className='h3 mb-spacer text-center' data-testid='delegateTitle'>
            {`${t('Make a proposal')}${actionTitle}`}
          </p>

          <div>
            {getModalContent()}
            <div className='modal-action-btns'>
              <button
                onClick={handleClose}
                className='btn btn-primary btn-light '
              >
                <FontAwesomeIcon icon={faTimes} />
                {t('Cancel')}
              </button>
              <button
                disabled={submitDisabled}
                onClick={onProposeClicked}
                className='btn btn-primary '
              >
                <FontAwesomeIcon icon={faHandPaper} />
                {t('Propose')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProposeModal;
