import { useEffect, useState } from 'react';
import QrCode from 'qrcode.react';
import { Modal } from 'react-bootstrap';
import { Typography } from '@mui/material';
import CopyButton from '../CopyButton';
import { MainButton, DepositDoneAction } from '../Theme/StyledComponents';

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
        <MainButton
          key="0"
          variant="outlined"
          className="shadow-sm rounded mr-2"
          onClick={handleOpenModal}
          sx={{
            opacity: '1 !important',
          }}
        >
          Receive
        </MainButton>
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
              <textarea style={{ borderColor: '#4c2ffc' }} readOnly value={address} className="address" />
              <Typography
                className="copy-btn"
                sx={{
                  backgroundColor: '#4c2ffc1a !important',
                  borderColor: '#4c2ffc !important',
                }}
              >
                <CopyButton text={address} />
              </Typography>
            </div>
            <div className="modal-action-btns">
              <DepositDoneAction
                onClick={handleQr === undefined ? handleCloseModal : handleQr}
                sx={{
                  backgroundColor: '#4c2ffc !important',
                  border: 'none',
                }}
              >
                Done
              </DepositDoneAction>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReceiveModal;
