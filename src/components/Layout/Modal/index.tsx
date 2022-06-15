import React from 'react';
import { useSelector } from 'react-redux';
import PerformActionModal from 'components/PerformActionModal';
import ProposeModal from 'pages/MultisigDetails/ProposeModal/ProposeModal';
import ProposeMultiselectModal from 'pages/MultisigDetails/ProposeMultiselectModal/ProposeMultiselectModal';
import {
  proposeModalSelectedOptionSelector,
  proposeMultiselectModalSelectedOptionSelector,
  selectedPerformedActionSelector,
} from 'redux/selectors/modalsSelector';

const ModalLayer = () => {
  const selectedAction = useSelector(selectedPerformedActionSelector);
  const selectedOption = useSelector(proposeModalSelectedOptionSelector);
  const selectedMultiselectOption = useSelector(
    proposeMultiselectModalSelectedOptionSelector,
  );
  return (
    <div>
      {selectedMultiselectOption != null && (
        <ProposeMultiselectModal selectedOption={selectedMultiselectOption} />
      )}
      {selectedOption != null && (
        <ProposeModal selectedOption={selectedOption} />
      )}
      {selectedAction != null && (
        <PerformActionModal selectedAction={selectedAction} />
      )}
    </div>
  );
};

export default ModalLayer;
