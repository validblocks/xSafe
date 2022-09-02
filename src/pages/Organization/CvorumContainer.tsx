import { Box, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { MultisigCard, PerformActionButton, Text } from 'src/components/StyledComponents/StyledComponents';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { useTranslation } from 'react-i18next';
import { isInReadOnlyModeSelector } from 'src/redux/selectors/accountSelector';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';

const CvorumContainer = () => {
  const dispatch = useDispatch();
  const isInReadOnlyMode = useSelector(isInReadOnlyModeSelector);
  const onChangeQuorum = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.change_quorum,
      }),
    );

  const {
    quorumCountState,
    boardMembersState,
  } = useOrganizationInfoContext();

  const [quorumCount] = quorumCountState;
  const [boardMembers] = boardMembersState;
  const boardMembersCount = boardMembers.length;
  const { t } = useTranslation();

  return (
    <Box>
      <MultisigCard>
        <Box minHeight={'60vh'} className="px-4 py-4">
          <Text fontSize={21} fontWeight={450}>Required Confirmations</Text>
          <Box fontSize={14} marginTop={2}>
            Performing an action requires the confirmation of:
          </Box>
          <Box marginY={2}>
            <Box
              component={'span'}
              fontSize={16}
              fontWeight={500}
            ><strong>{quorumCount}</strong>
              <Box
                component={'span'}
                color={'#B2B5B2'}
              > out of
              </Box> <strong>{boardMembersCount}</strong>
              <Box
                component={'span'}
                color={'#B2B5B2'}
              > owners
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box className="px-4 py-4">
          <PerformActionButton
            disabled={isInReadOnlyMode}
            size="large"
            onClick={onChangeQuorum}
            sx={{
              padding: '1rem !important',
            }}
          >
            {t('Change Quorum') as string}
          </PerformActionButton>
        </Box>
      </MultisigCard>
    </Box>
  );
};

export default CvorumContainer;
