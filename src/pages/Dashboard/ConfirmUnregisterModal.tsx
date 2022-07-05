import React from 'react';
import { Ui } from '@elrondnetwork/dapp-utils';
import { faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { network } from '../../config';

interface ConfirmUnregisterModalPropsType {
  show: boolean;
  handleClose: (e: any) => void;
  onConfirmed: (e: any) => void;
  address: string;
}

const ConfirmUnregisterModal = ({
  show,
  handleClose,
  onConfirmed,
  address,
}: ConfirmUnregisterModalPropsType) => {
  const { t }: { t: any } = useTranslation();

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body ">
          <p className="h4 text-center" data-testid="confirmDeleteTitle">
            {t('Are you sure you want to unregister this contract?')}
          </p>
          <div className="mt-5 d-flex wallet-address">
            <Ui.Trim text={address} />
            <a
              href={`${network.explorerAddress}/accounts/${address}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              rel="noreferrer"
              className="link-second-style ml-2"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
            </a>
          </div>
          <div className="modal-action-btns">
            <button
              onClick={handleClose}
              className="btn btn-primary btn-light "
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('Cancel')}
            </button>
            <button onClick={onConfirmed} className="btn btn-primary mb-3">
              {t('Confirm')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmUnregisterModal;
