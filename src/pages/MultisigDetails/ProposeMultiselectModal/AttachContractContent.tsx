import {
  getAccountProviderType,
  transactionServices,
} from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs';
import { useFormik } from 'formik';
// import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { buildBlockchainTransaction } from 'src/contracts/transactionUtils';
import { currentMultisigAddressSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { validateContractAddressOwner } from 'src/helpers/validation';
import { ProposalsTypes } from 'src/types/Proposals';
import { ActionResponseButton } from 'src/components/Theme/StyledComponents';
import { Box } from '@mui/material';
import { FormikInputField } from 'src/helpers/formikFields';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const gasLimit = 10_000_000;

interface AttachContractContentProps {
  handleClose: () => void;
}
const AttachContractContent = ({ handleClose }: AttachContractContentProps) => {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();

  const providerType = getAccountProviderType();
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
        transactionServices.sendTransactions({ transactions: transaction });
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
    <Box padding={'1.5rem 2.5rem 1.9rem'}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <p className="h3 mb-4" data-testid="delegateTitle">
          {t('Attach smart contract')}
        </p>
        <CloseRoundedIcon onClick={handleClose} sx={{ mb: '1.5rem', cursor: 'pointer' }} />
      </Box>
      <Box
        mb={'10px'}
        className={contractAddressError ? 'invalid' : ''}
      >
        <FormikInputField
          label={t('Contract address')}
          name="contractAddress"
          value={formik.values.contractAddress}
          error={contractAddressError}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          className={contractAddressError ? 'isError' : ''}
        />

      </Box>
      <div className="d-flex">
        <ActionResponseButton
          onClick={onGoBackClicked}
          sx={{ mr: '10px' }}
        >
          {t('Back')}
        </ActionResponseButton>
        <ActionResponseButton
          disabled={contractAddressError != null}
          onClick={() => formik.handleSubmit()}
          sx={{ ml: '10px' }}
        >
          {t('Attach')}
        </ActionResponseButton>
      </div>
    </Box>
  );
};

export default AttachContractContent;
