import { useSelector } from 'react-redux';
import PerformActionModal from 'src/components/PerformActionModal';
import ProposeModal from 'src/pages/MultisigDetails/ProposeModal/ProposeModal';
import ProposeMultiselectModal from 'src/pages/MultisigDetails/ProposeMultiselectModal/ProposeMultiselectModal';
import {
  proposeModalSelectedOptionSelector,
  proposeMultiselectModalSelectedOptionSelector,
  selectedPerformedActionSelector,
} from 'src/redux/selectors/modalsSelector';

function ModalLayer() {
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
}

export default ModalLayer;
