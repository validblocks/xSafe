import React from 'react';
import {
  faInfoCircle,
  faMinus,
  faPlus,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export interface StatCardType {
  title?: string;
  value?: string;
  valueUnit?: string;
  svg?: string;
  color?: string;
  percentage?: string;
  tooltipText?: string;
  children?: any;
  onAddAction?: () => void;
  onRemoveAction?: () => void;
  onEditAction?: () => void;
}

const StatCard = ({
  title = '',
  value = '0',
  valueUnit = '',
  percentage = '',
  tooltipText = '',
  onAddAction,
  onRemoveAction,
  onEditAction
}: StatCardType) => {
  return (
    <div className={'statcard text-black'}>
      <span className='h5 title'>{title}</span>

      <small className='opacity-5'>
        {percentage}
        {tooltipText !== '' && (
          <OverlayTrigger
            placement='top'
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => (
              <Tooltip id='button-tooltip' {...props}>
                {tooltipText}
              </Tooltip>
            )}
          >
            <FontAwesomeIcon icon={faInfoCircle} className='text-black ml-1' />
          </OverlayTrigger>
        )}
      </small>
      <div className={'d-flex justify-content-center actions'}>
        <p className='h5 mb-0 order-2 centering value'>
          {value} {valueUnit}
        </p>
        {onEditAction != null && (
          <button
            onClick={onEditAction}
            className={'action-edit m-lg-2 order-2'}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
        )}

        {onRemoveAction != null && (
          <button
            onClick={onRemoveAction}
            className={'action-remove m-lg-1 order-1'}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
        )}
        {onAddAction != null && (
          <button onClick={onAddAction} className={'action-add m-lg-1 order-3'}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatCard;
