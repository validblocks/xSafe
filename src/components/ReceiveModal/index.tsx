import { useEffect, useState } from 'react';
import QrCode from 'qrcode.react';
import { Modal } from 'react-bootstrap';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Typography, Box } from '@mui/material';
import { useTheme } from 'styled-components';
import CopyButton from '../CopyButton';
import { MainButton, DepositDoneAction } from '../Theme/StyledComponents';
import { Text } from '../StyledComponents/StyledComponents';

const ReceiveModal = ({
  showQrFromSidebar,
  address,
  handleQr,
  showQrFromCard = false,
}: {
  showQrFromSidebar?: boolean;
  showQrFromCard?: boolean;
  address?: string;
  handleQr?: () => void;
}) => {
  const theme: any = useTheme();
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
            width: '100%',
            ...(showQrFromCard && {
              fontSize: '14px !important',
              marginTop: '15px !important',
            }),
          }}
        >
          <QrCode2Icon sx={{ marginRight: '5px', fontSize: '16px' }} />
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
          <Box className="card-body text-center receive" sx={{ backgroundColor: theme.palette.background.secondary, borderRadius: '10px' }}>
            <p className="h3 mb-spacer title" data-testid="delegateTitle">
              <Text fontSize={24}>Deposit</Text>
            </p>

            <QrCode value={address} size={256} />
            <div
              className="h6 mb-spacer copy-address"
              data-testid="delegateSubTitle"
            >
              <textarea style={{ borderColor: '#4c2ffc', backgroundColor: theme.palette.background.secondary }} readOnly value={address} className="address" />
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
          </Box>
        </div>
      </Modal>
    </>
  );
};

export default ReceiveModal;
