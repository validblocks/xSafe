import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import PageState from 'components/PageState';
import { notificationModalSelector } from '@redux/selectors/modalsSelector';
import { clearNotificationModal } from '@redux/slices/modalsSlice';

const NotificationModal = () => {
  const notificationModal = useSelector(notificationModalSelector);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    setShowModal(Boolean(notificationModal));
  }, [notificationModal]);

  const toggleModal = (show: boolean) => () => {
    setShowModal(show);
  };

  const onDone = () => {
    setShowModal(false);
    dispatch(clearNotificationModal());
  };

  return (
    <>
      {showModal && notificationModal && (
        <Modal
          show={showModal}
          backdrop
          onHide={toggleModal(false)}
          className="modal-container"
          animation={false}
          centered
        >
          <div className="card w-100 notification-modal">
            <PageState
              icon={notificationModal.icon}
              iconClass={notificationModal.iconClassName}
              iconBgClass="p-4 rounded-bg-circle"
              iconSize="3x"
              title={notificationModal.title}
              description={notificationModal.description}
              action={(
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onDone();
                  }}
                >
                  Done
                </button>
              )}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default NotificationModal;
