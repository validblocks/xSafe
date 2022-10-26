import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import PageState from 'src/components/PageState';
import { notificationModalSelector } from 'src/redux/selectors/modalsSelector';
import { useEffect, useState } from 'react';
import { clearNotificationModal } from 'src/redux/slices/modalsSlice';

const NotificationModal = () => {
  const notificationModal = useSelector(notificationModalSelector);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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
    <div>
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
              icon={notificationModal.icon as IconProp}
              iconClass={notificationModal.iconClassName}
              iconBgClass="p-4 rounded-bg-circle"
              iconSize="3x"
              title={notificationModal.title}
              description={notificationModal.description}
              // eslint-disable-next-line react/jsx-curly-brace-presence
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
    </div>
  );
};

export default NotificationModal;
