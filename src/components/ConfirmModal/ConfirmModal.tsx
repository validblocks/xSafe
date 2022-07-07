import { Modal } from 'react-bootstrap';

interface ConfirmModalType {
  title: string;
  confirmButtonTitle: string;
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

function ConfirmModal({
  title,
  confirmButtonTitle,
  show,
  handleClose,
  handleConfirm,
}: ConfirmModalType) {
  const onConfirmClicked = () => {
    handleConfirm();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            {title}
          </p>

          <div>
            <button onClick={onConfirmClicked} className="btn btn-primary mb-3">
              {confirmButtonTitle}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
