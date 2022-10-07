import { Box, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { MultisigCard, PerformActionButton, Text } from 'src/components/StyledComponents/StyledComponents';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';

const CvorumContainer = () => {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
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
            <Text>Performing an action requires the confirmation of:</Text>
          </Box>
          <Box marginY={2}>
            <Box
              component={'span'}
              fontSize={16}
              fontWeight={500}
              sx={{ color: theme.palette.text.primary }}
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
          >
            {t('Change Quorum') as string}
          </PerformActionButton>
        </Box>
      </MultisigCard>
    </Box>
  );
};

export default CvorumContainer;
