import { Box, Typography } from '@mui/material';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useTranslation } from 'react-i18next';
import { ChangeQuorumButton } from 'src/components/Theme/StyledComponents';
import { useEffect, useState } from 'react';
import { mutateProposeChangeQuorum } from 'src/contracts/MultisigContract';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import * as Styled from './styled/index';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';

const CvorumContainer = () => {
  const [error, setError] = useState<string | null>(null);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState(false);
  const [isDecrementDisabled, setIsDecrementDisabled] = useState(false);
  const errors = {
    invalid: 'Invalid value',
    tooBig: 'Quorum cannot be bigger than the number of board members',
  };

  const {
    quorumCountState,
    boardMembersState,
  } = useOrganizationInfoContext();

  const { isInReadOnlyMode } = useOrganizationInfoContext();

  const [quorumCount] = quorumCountState;
  const [newQuorum, setNewQuorum] = useState(quorumCount);
  const [boardMembers] = boardMembersState;
  const boardMembersCount = boardMembers.length;

  const { t } = useTranslation();

  const handleIncrementCount = () => setNewQuorum((newQuorum) => {
    const quorumValue = newQuorum + 1;
    if (quorumValue > boardMembersCount) {
      setError(errors.tooBig);
      setIsIncrementDisabled(true);
      setIsDecrementDisabled(false);
    } else {
      setError(null);
      setIsIncrementDisabled(false);
      setIsDecrementDisabled(false);
    }
    return quorumValue;
  });

  const handleDecrementCount = () => setNewQuorum((newQuorum) => {
    const quorumValue = newQuorum - 1;
    if (quorumValue < 1) {
      setError(errors.invalid);
      setIsDecrementDisabled(true);
      setIsIncrementDisabled(false);
    } else {
      setError(null);
      setIsDecrementDisabled(false);
      setIsIncrementDisabled(false);
    }
    return quorumValue;
  });

  useEffect(() => {
    setNewQuorum(quorumCount);
  }, [quorumCount]);

  const onChangeQuorum = () => mutateProposeChangeQuorum(newQuorum);

  console.log(error);

  return (
    <Styled.CvorumContainer>
      <Box>
        <Text fontSize={21} fontWeight={450}>Required Confirmations</Text>
        <Box fontSize={14} marginTop={2}>
          <Text>Performing an action requires the confirmation of:</Text>
        </Box>

        <Styled.QuorumCounterContainer>
          <Styled.QuorumCounterButton
            onClick={() => handleDecrementCount()}
            startIcon={<RemoveRoundedIcon />}
            disabled={isDecrementDisabled}
          />
          <Styled.QuorumContent>
            <Typography component="span">{newQuorum} / {boardMembersCount}</Typography>members
          </Styled.QuorumContent>
          <Styled.QuorumCounterButton
            onClick={() => handleIncrementCount()}
            startIcon={<AddRoundedIcon />}
            disabled={isIncrementDisabled}
          />
          <Styled.QuorumErrorMessage
            className={error !== null ? 'is-invalid' : ''}
          >{error}
          </Styled.QuorumErrorMessage>
        </Styled.QuorumCounterContainer>
      </Box>

      <ChangeQuorumButton
        disabled={isInReadOnlyMode || error !== null}
        size="large"
        onClick={onChangeQuorum}
      >
        {t('Propose quorum change') as string}
      </ChangeQuorumButton>
    </Styled.CvorumContainer>
  );
};

export default CvorumContainer;
