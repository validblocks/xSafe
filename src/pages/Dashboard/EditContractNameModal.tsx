import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface EditContractNameModalPropsType {
  show: boolean;
  contractName: string;
  onConfirm: (name: string) => void;
  onCancel: (e: any) => void;
}

const EditContractNameModal = ({
  show,
  contractName,
  onConfirm,
  onCancel
}: EditContractNameModalPropsType) => {
  const { t }: { t: any } = useTranslation();

  const [name, setName] = useState(contractName);

  function handleChangeName(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setName(e.target.value);
  }

  function handleConfirm(e: any) {
    e.preventDefault();
    e.stopPropagation();
    onConfirm(name);
    onCancel(e);
  }

  return (
    <Modal
      show={show}
      onHide={onCancel}
      className='modal-container'
      animation={false}
      centered
    >
      <div className='card'>
        <div className='card-body p-spacer '>
          <p className='h3 text-center' data-testid='delegateTitle'>
            {t('Edit contract name')}
          </p>

          <div className='modal-control-container'>
            <label>{t('Name')}: </label>
            <input
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              type='text'
              className='form-control'
              value={name}
              autoComplete='off'
              onChange={handleChangeName}
            />
          </div>

          <div className='modal-action-btns'>
            <button onClick={onCancel} className='btn btn-primary btn-light '>
              <FontAwesomeIcon icon={faTimes} />
              {t('Cancel')}
            </button>
            <button onClick={handleConfirm} className='btn btn-primary mb-3'>
              {t('Confirm')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditContractNameModal;
