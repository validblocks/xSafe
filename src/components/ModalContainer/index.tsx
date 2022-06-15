import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { multisigOriginSelector } from '@redux/selectors/appConfigSelector';

const ModalContainer = ({
  children,
  noSpacer,
  className,
  title,
}: {
  children: React.ReactNode;
  noSpacer?: boolean;
  className?: string;
  title: React.ReactNode;
}) => {
  const multisigOrigin = useSelector(multisigOriginSelector);
  const [close, setClose] = React.useState(false);

  const handleClose = () => {
    setClose(true);
  };

  React.useEffect(
    () => () => {
      setClose(false);
    },
    [],
  );

  return close ? (
    <Navigate
      to={{
        pathname: multisigOrigin.pathname,
        search: multisigOrigin.search,
      }}
    />
  ) : (
    <Modal
      show
      backdrop="static"
      onHide={handleClose}
      className={`modal-container ${className || ''}`}
      animation={false}
      centered
    >
      <div className="modal-card card w-100">
        <div className="card-title h5 mb-0">
          <div className="d-flex justify-content-between align-items-center pt-spacer px-spacer mb-0">
            <div>{title}</div>
            <button
              type="button"
              className="btn btn-light px-3 py-2"
              onClick={handleClose}
            >
              <FontAwesomeIcon size="lg" icon={faTimes} />
            </button>
          </div>
        </div>

        <div
          className={`modal-card-body text-center ${
            noSpacer ? 'p-0' : 'p-spacer'
          }`}
        >
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default ModalContainer;
