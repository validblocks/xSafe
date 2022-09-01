import { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { faHandPaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  mutateProposeChangeQuorum,
  mutateProposeAddProposer,
  mutateProposeAddBoardMember,
  mutateProposeRemoveUser,
} from 'src/contracts/MultisigContract';
import { addEntry } from 'src/redux/slices/addressBookSlice';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes, SelectedOptionType } from 'src/types/Proposals';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { Box } from '@mui/material';
import EditOwner from './EditOwner';
import ProposeChangeQuorum from './ProposeChangeQuorum';
import ProposeInputAddress from './ProposeInputAddress';
import ProposeRemoveUser from './ProposeRemoveUser';
import ReplaceOwner from './ReplaceOwner';

interface ProposeModalPropsType {
  selectedOption: SelectedOptionType;
}

function ProposeModal({ selectedOption }: ProposeModalPropsType) {
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [selectedNumericParam, setSelectedNumericParam] = useState(1);
  const [selectedAddressParam, setSelectedAddressParam] = useState(
    new Address(),
  );
  const [selectedNameParam, setSelectedNameParam] = useState('');
  const [selectedReplacementAddressParam] = useState(new Address());

  const handleClose = () => {
    dispatch(setProposeModalSelectedOption(null));
  };

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
        case ProposalsTypes.edit_owner:
          dispatch(
            addEntry({
              address: selectedAddressParam.bech32(),
              name: selectedNameParam,
            }),
          );
          break;
        case ProposalsTypes.replace_owner:
          mutateProposeRemoveUser(selectedAddressParam);
          mutateProposeAddBoardMember(selectedReplacementAddressParam);
          dispatch(
            addEntry({
              address: selectedReplacementAddressParam.bech32(),
              name: selectedNameParam,
            }),
          );
          break;
        default:
          console.error(`Unrecognized option ${selectedOption}`);
          break;
      }
      handleClose();
    } catch (err) {
      handleClose();
    }
  };

  const handleNumericParamChange = (value: number) => {
    setSelectedNumericParam(value);
  };

  const handleAddressParamChange = (value: Address) => {
    setSelectedAddressParam(value);
  };

  if (selectedOption == null) {
    return null;
  }
  // eslint-disable-next-line consistent-return
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
      case ProposalsTypes.edit_owner:
        return (
          <EditOwner
            handleSetAddress={handleAddressParamChange}
            handleSetName={(value) => setSelectedNameParam(value)}
            selectedOption={selectedOption}
          />
        );
      case ProposalsTypes.replace_owner:
        return (
          <ReplaceOwner
            handleSetAddress={handleAddressParamChange}
            handleSetName={(value) => setSelectedNameParam(value)}
            selectedOption={selectedOption}
          />
        );
      default:
    }
  };

  return (
    <Modal
      show
      size="lg"
      onHide={handleClose}
      className="modal-container proposal-modal"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body">

          <div>
            {getModalContent()}
            <Box className="modal-action-btns" sx={{ mt: '24px !important' }}>
              <MainButton
                onClick={handleClose}
                sx={{ boxShadow: 'none !important' }}
              >
                {t('Cancel')}
              </MainButton>
              <MainButton
                disabled={submitDisabled}
                onClick={onProposeClicked}
                sx={{ gap: '5px !important' }}
              >
                <FontAwesomeIcon icon={faHandPaper} />
                {t('Add')}
              </MainButton>
            </Box>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProposeModal;
