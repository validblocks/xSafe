import { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  addContractToMultisigContractsList,
} from 'src/apiCalls/multisigContractsCalls';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { Box } from '@mui/material';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useTheme } from 'styled-components';
import { FinalStepActionButton, MainButton, ProposeAddressInput } from 'src/components/Theme/StyledComponents';
import ProposeInputAddress from '../MultisigDetails/ProposeModal/ProposeInputAddress';

interface AddMultisigModalType {
  show: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

function AddMultisigModal({
  show,
  handleClose,
  setNewContracts,
}: AddMultisigModalType) {
  const { t } = useTranslation();

  const [address, setAddress] = useState(Address.Zero());
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [invalidMultisigAddress, setInvalidMultisigAddress] = useState(false);
  const [name, setName] = useState('');
  const { isLoggedIn } = useGetLoginInfo();

  async function onAddressParamChange(newAddress: Address) {
    setInvalidMultisigAddress(false);
    setAddress(newAddress);
  }
  async function onContractNameChange(e: any) {
    setName(e.target.value);
  }
  async function onAddClicked() {
    const contractAddress = address.bech32();
    const isAddressValid = await ElrondApiProvider.validateMultisigAddress(contractAddress);
    if (isAddressValid) {
      const newContracts = await addContractToMultisigContractsList({
        address: contractAddress,
        name,
      });
      setNewContracts(newContracts);
      handleClose();
    } else {
      setInvalidMultisigAddress(true);
    }
  }

  const theme: any = useTheme();

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <Box sx={{ backgroundColor: theme.palette.background.secondary }} className="modal-content">
        <Box py={2} px={4} borderBottom={`1px solid ${theme.palette.divider.main}`}>
          <Text fontSize={24} textAlign={'left'}>
            {t('Add Multisig') as string}
          </Text>
        </Box>
        <Box py={2} px={4} mt={2}>
          <ProposeInputAddress
            invalidAddress={invalidMultisigAddress}
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={(newAddress) =>
              onAddressParamChange(newAddress)
            }
          />
          <Box mt={3}>
            <ProposeAddressInput
              label={`${t('Contract name')}`}
              id={name}
              value={name}
              autoComplete="off"
              onChange={(e) => onContractNameChange(e)}
              sx={{
                '& input': {
                  color: theme.palette.text.primary,
                },
                '& label': {
                  color: theme.palette.text.secondary,
                },
                '&:hover fieldset': {
                  borderColor: `${theme.palette.borders.active} !important`,
                },
                '& p.MuiFormHelperText-root': {
                  ml: '.35rem !important',
                  fontSize: '11.2px',
                },
                '& fieldset': {
                  borderColor: `${theme.palette.borders.secondary} !important`,
                },
                '&:focus-within': {
                  '& fieldset': { borderColor: `${theme.palette.borders.active} !important` },
                  '& label': { color: '#4c2ffc' },
                },
                '&.isAddressError:focus-within': {
                  '& label': { color: '#e51a3e !important' },
                },
              }}
            />
          </Box>
          <Box className="modal-action-btns">
            <MainButton
              onClick={handleClose}
              sx={{ boxShadow: 'none !important' }}
            >
              {t('Cancel') as string}
            </MainButton>

            <FinalStepActionButton
              disabled={(submitDisabled || !isLoggedIn)}
              onClick={() => onAddClicked()}
            >
              {isLoggedIn ? (t('Add') as string) : (t('Login first') as string)}
            </FinalStepActionButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddMultisigModal;
