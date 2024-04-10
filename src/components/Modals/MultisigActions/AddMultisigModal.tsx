import { useCallback } from 'react';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import * as Yup from 'yup';
import { addContractToMultisigContractsList } from 'src/apiCalls/multisigContractsCalls';
import { MultisigContractInfoType } from 'src/types/multisig/multisigContracts';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { Box, useMediaQuery } from '@mui/material';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import {
  FinalStepActionButton,
  MainButton,
  ModalContainer,
} from 'src/components/Theme/StyledComponents';
import ModalCardTitle from 'src/components/Layout/Modal/ModalCardTitle';
import { FormikProps, useFormik } from 'formik';
import FormikInputField from 'src/helpers/formikFields';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useDispatch } from 'react-redux';
import {
  setCurrentMultisigContract,
  setMultisigContracts,
} from 'src/redux/slices/multisigContractsSlice';
import { verifiedContractsHashes } from 'src/helpers/constants';
import { tryParseAddressElseThrow } from 'src/utils/addressUtils';

interface AddMultisigModalType {
  show: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

interface IFormValues {
  address: string;
  name: string;
}

function AddMultisigModal({
  show,
  handleClose,
  setNewContracts,
}: AddMultisigModalType) {
  const t = useCustomTranslation();

  const { isLoggedIn } = useGetLoginInfo();

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const theme = useCustomTheme();
  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      address: '',
      name: '',
    },
    validationSchema: Yup.object().shape({
      address: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Required')
        .test(
          'is valid address',
          'Not a valid multisig address',
          async (value?: string) => {
            try {
              const validAddress = tryParseAddressElseThrow(value);

              if (!validAddress) return false;

              const returnedAccountDetails =
                await MultiversxApiProvider.getAccountDetails(
                  validAddress.bech32(),
                );

              return (
                returnedAccountDetails &&
                verifiedContractsHashes.includes(
                  returnedAccountDetails.codeHash,
                )
              );
            } catch (err) {
              return false;
            }
          },
        ),
      name: Yup.string()
        .min(3, 'Too Short!')
        .max(10, 'Too Long!')
        .required('Required'),
    }),
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { touched, errors, values } = formik;
  const { address: safeAddress, name } = values;
  const hasAddressErrors = touched.address && errors.address;
  const hasSafeNameErrors = touched.name && errors.name;
  const hasErrors = !!hasSafeNameErrors || !!hasAddressErrors || !isLoggedIn;
  const isDisabled = !touched.address || !touched.name || hasErrors;

  const dispatch = useDispatch();
  const onAddClicked = useCallback(async () => {
    const contractAddress = safeAddress;
    const isAddressValid = await MultiversxApiProvider.validateMultisigAddress(
      contractAddress,
    );
    if (isAddressValid) {
      const newContracts = await addContractToMultisigContractsList({
        address: contractAddress,
        name,
      });
      await dispatch(setMultisigContracts(newContracts));
      dispatch(setCurrentMultisigContract(contractAddress));
      setNewContracts(newContracts);
      handleClose();
    }
  }, [safeAddress, name, dispatch, setNewContracts, handleClose]);

  const handleCloseAddExistingMultisig = useCallback(() => {
    formik.handleReset();
    handleClose();
  }, [formik, handleClose]);

  return (
    <ModalContainer
      size="lg"
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation
      centered
      autoFocus={false}
    >
      <Box
        sx={{ backgroundColor: theme.palette.background.secondary }}
        className="modal-content"
      >
        <ModalCardTitle
          title={t('Load an existing Safe') as string}
          handleClose={handleCloseAddExistingMultisig}
        />
        <Box py={2} px={maxWidth600 ? 2 : 4} mt={maxWidth600 ? 0 : 2}>
          <FormikInputField
            label={t('Safe name')}
            name="name"
            value={name}
            error={hasSafeNameErrors}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            className={hasSafeNameErrors != null ? 'isError' : ''}
          />
          <Box mt={3}>
            <FormikInputField
              label={t('Safe address')}
              name="address"
              value={safeAddress}
              error={hasAddressErrors}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              className={hasAddressErrors != null ? 'isError' : ''}
            />
          </Box>
          <Box
            className="modal-action-btns"
            marginTop={maxWidth600 ? '24px !important' : ''}
          >
            <MainButton
              onClick={handleCloseAddExistingMultisig}
              sx={{
                boxShadow: 'none !important',
                height: '34px !important',
                maxWidth: 'none !important',
              }}
            >
              <Text>{t('Cancel') as string}</Text>
            </MainButton>

            <FinalStepActionButton
              disabled={isDisabled}
              onClick={() => onAddClicked()}
              sx={{ height: '34px !important', maxWidth: 'none !important' }}
            >
              {isLoggedIn ? (t('Add') as string) : (t('Login first') as string)}
            </FinalStepActionButton>
          </Box>
        </Box>
      </Box>
    </ModalContainer>
  );
}

export default AddMultisigModal;
