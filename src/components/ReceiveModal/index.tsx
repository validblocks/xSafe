import { useEffect, useState } from 'react';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QrCode from 'qrcode.react';
import { Modal } from 'react-bootstrap';
import CopyButton from '../CopyButton';

const ReceiveModal = ({
  showQrFromSidebar,
  address,
  handleQr,
}: {
  showQrFromSidebar?: boolean;
  address?: string;
  handleQr?: () => void;
}) => {
  const [showModal, setShowModal] = useState<boolean | undefined>(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    if (showQrFromSidebar !== undefined) setShowModal(showQrFromSidebar);
  }, [showQrFromSidebar]);

  if (!address) {
    return null;
  }

  return (
    <>
      {showQrFromSidebar === undefined && (
        <button onClick={handleOpenModal} className="btn btn-primary">
          <span className="icon">
            <FontAwesomeIcon icon={faQrcode} />
          </span>
          <span className="name">Deposit</span>
        </button>
      )}
      <Modal
        show={showModal}
        size="lg"
        onHide={handleQr === undefined ? handleCloseModal : handleQr}
        className="modal-container"
        animation={false}
        centered
      >
        <div className="card">
          <div className="card-body text-center receive">
            <p className="h3 mb-spacer title" data-testid="delegateTitle">
              Deposit
            </p>

            <QrCode value={address} size={256} />
            <div
              className="h6 mb-spacer copy-address"
              data-testid="delegateSubTitle"
            >
              <textarea readOnly value={address} className="address" />
              <span className="copy-btn">
                <CopyButton text={address} />
              </span>
            </div>
            <div className="modal-action-btns">
              <button
                onClick={handleQr === undefined ? handleCloseModal : handleQr}
                className="btn btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ReceiveModal;
