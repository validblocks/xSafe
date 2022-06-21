import {
  getAccountProviderType,
  transactionServices,
} from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs';
import { faArrowLeft, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { buildBlockchainTransaction } from 'contracts/transactionUtils';
import { validateContractAddressOwner } from 'helpers/validation';
import { currentMultisigAddressSelector } from '@redux/selectors/multisigContractsSelectors';
import { setProposeMultiselectSelectedOption } from '@redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

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
    <div className="card attach-contract-content">
      <div className="card-body">
        <p className="h3 mb-spacer text-center" data-testid="delegateTitle">
          {t('Attach smart contract')}
        </p>

        <div className="modal-control-container">
          <label htmlFor={formik.values.contractAddress}>
            {t('Contract address')}
          </label>
          <div className="input-wrapper">
            <Form.Control
              id={formik.values.contractAddress}
              name="contractAddress"
              type="text"
              isInvalid={contractAddressError != null}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.contractAddress}
            />
            {contractAddressError != null && (
              <Form.Control.Feedback type="invalid">
                {contractAddressError}
              </Form.Control.Feedback>
            )}
          </div>
        </div>
      </div>
      <div className="modal-action-btns">
        <button
          onClick={onGoBackClicked}
          className="btn btn-primary btn-light "
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t('Back')}
        </button>
        <button
          disabled={contractAddressError != null}
          onClick={() => formik.handleSubmit()}
          className="btn btn-primary "
        >
          <FontAwesomeIcon icon={faLink} />
          {t('Attach')}
        </button>
      </div>
    </div>
  );
};

export default AttachContractContent;
