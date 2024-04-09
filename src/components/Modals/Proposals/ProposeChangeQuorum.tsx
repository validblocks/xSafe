import { useState } from 'react';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { InputsContainer } from 'src/components/Theme/StyledComponents';
import { useOrganizationInfoContext } from 'src/components/Providers/OrganizationInfoContextProvider';
import * as Styled from 'src/components/Utils/styled';

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
  setSubmitDisabled,
}: ProposeChangeQuorumType) {
  const { boardMembersCount } = useOrganizationInfoContext();
  const t = useCustomTranslation();

  const [newQuorumSize, setNewQuorumSize] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleNewQuorumSizeChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newQuorum = Number(event.target.value);
    if (Number.isNaN(newQuorum) || newQuorum < 1) {
      setError(errors.invalid);
      setSubmitDisabled(true);
    } else if (newQuorum > boardMembersCount) {
      setError(errors.tooBig);
      setSubmitDisabled(true);
    } else {
      setError(null);
      handleParamsChange(newQuorum);
      setSubmitDisabled(false);
    }
    setNewQuorumSize(newQuorum);
  };

  return (
    <InputsContainer
      className={
        error != null ? 'hasAvailableAmount invalid' : 'hasAvailableAmount'
      }
    >
      <Styled.TextField
        id="newQuorumSize"
        type="number"
        value={newQuorumSize}
        autoComplete="off"
        focused={false}
        onChange={handleNewQuorumSizeChanged}
      />
      <label htmlFor="newQuorumSize">{t('Quorum Size')}</label>
      <span className="errorMessage">{error}</span>
    </InputsContainer>
  );
}

export default ProposeChangeQuorum;
