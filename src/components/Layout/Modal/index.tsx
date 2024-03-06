import { useSelector } from 'react-redux';
import PerformActionModal from 'src/components/Modals/PerformAction';
import ProposeModal from 'src/components/Modals/Proposals/ProposeModal';
import ProposeMultiselectModal from 'src/components/Modals/Proposals/ProposeMultiselectModal';
import {
  proposeModalSelectedOptionSelector,
  proposeMultiselectModalSelectedOptionSelector,
  selectedPerformedActionSelector,
} from 'src/redux/selectors/modalsSelector';

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
