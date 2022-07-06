import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import MultisigDetailsContext from 'src/context/MultisigDetailsContext';

interface ProposeChangeQuorumType {
  handleParamsChange: (params: number) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const errors = {
  invalid: 'Invalid value',
  tooBig: 'Quorum cannot be bigger than the number of board members',
};

function ProposeChangeQuorum({
  handleParamsChange,
  setSubmitDisabled
}: ProposeChangeQuorumType) {
  const { quorumSize, totalBoardMembers } = useContext(MultisigDetailsContext);
  const { t }: { t: any } = useTranslation();

  const [newQuorumSize, setNewQuorumSize] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleNewQuorumSizeChanged = (event: any) => {
    const newQuorum = Number(event.target.value);
    if (Number.isNaN(newQuorum) || newQuorum < 1) {
      setError(errors.invalid);
      setSubmitDisabled(true);
    } else if (newQuorum > totalBoardMembers || newQuorum < 1) {
      setError(errors.tooBig);
      setSubmitDisabled(true);
    } else {
      setError(null);
      handleParamsChange(newQuorum);
      setSubmitDisabled(false);
    }
    setNewQuorumSize(newQuorum);
  };

  useEffect(() => {
    setNewQuorumSize(quorumSize);
  }, [quorumSize]);

  return (
    <div className="d-flex flex-column modal-control-container">
      <div className="group-center">
        <label htmlFor="newQuorumSize">{t('Quorum Size')}:</label>
        <input
          id="newQuorumSize"
          style={{ width: 250 }}
          className="form-control"
          value={newQuorumSize}
          autoComplete="off"
          onChange={handleNewQuorumSizeChanged}
        />
        {error != null && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
}

export default ProposeChangeQuorum;
