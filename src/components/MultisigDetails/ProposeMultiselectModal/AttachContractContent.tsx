import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { Address } from '@multiversx/sdk-core';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { buildBlockchainTransaction } from 'src/utils/transactionUtils';
import { currentMultisigAddressSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { validateContractAddressOwner } from 'src/helpers/validation';
import { ProposalsTypes } from 'src/types/multisig/proposals/Proposals';
import { ActionResponseButton } from 'src/components/Theme/StyledComponents';
import { Box } from '@mui/material';
import { FormikInputField } from 'src/helpers/formikFields';
import { useGetAccountProvider } from '@multiversx/sdk-dapp/hooks';
import ModalCardTitle from 'src/components/Layout/Modal/ModalCardTitle';
import * as Styled from './styled';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';

const gasLimit = 10_000_000;

interface AttachContractContentProps {
  handleClose: () => void;
}
const AttachContractContent = ({ handleClose }: AttachContractContentProps) => {
  const t = useCustomTranslation();
  const dispatch = useDispatch();

  const { providerType } = useGetAccountProvider();
  const currentMultisigAddress = useSelector(currentMultisigAddressSelector);

  const validationSchema = Yup.object().shape({
    contractAddress: Yup.string()
      .required('Required')
      .test(validateContractAddressOwner(currentMultisigAddress)),
  });

  const formik = useFormik({
    initialValues: {
      contractAddress: '',
    },
    onSubmit: (values: any) => {
      try {
        const data = `ChangeOwnerAddress@${currentMultisigAddress?.hex()}`;

        const transaction = buildBlockchainTransaction(
          0,
          providerType,
          new Address(values.contractAddress),
          data,
          gasLimit,
        );
        sendTransactions({ transactions: transaction });
        handleClose();
      } catch (error) {
        alert('An error occurred, please try again');
      }
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  const { touched, errors } = formik;

  const onGoBackClicked = () => {
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options,
      }),
    );
  };

  const contractAddressError =
    touched.contractAddress && errors.contractAddress;

  return (
    <>
      <ModalCardTitle
        title={t('Attach smart contract') as string}
        handleClose={handleClose}
      />
      <Styled.AttachSmartContractModalContainer>
        <Box mb={'10px'} className={contractAddressError ? 'invalid' : ''}>
          <FormikInputField
            label={t('Contract address')}
            name="contractAddress"
            value={formik.values.contractAddress}
            error={contractAddressError?.toString()}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            className={contractAddressError ? 'isError' : ''}
          />
        </Box>
        <div className="d-flex">
          <ActionResponseButton onClick={onGoBackClicked} sx={{ mr: '4px' }}>
            {t('Back')}
          </ActionResponseButton>
          <ActionResponseButton
            disabled={contractAddressError != null}
            onClick={() => formik.handleSubmit()}
            sx={{ ml: '4px' }}
          >
            {t('Attach')}
          </ActionResponseButton>
        </div>
      </Styled.AttachSmartContractModalContainer>
    </>
  );
};

export default AttachContractContent;
