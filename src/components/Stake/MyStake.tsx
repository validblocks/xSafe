import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setProposeMultiselectSelectedOption, setNeedsReshuffle } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import AssetsTable from '../Assets/AssetsTable';
import MyClaimableRewards from './MyClaimableRewards';
import MyTotalStake from './MyTotalStake';
import { MainButton } from '../Theme/StyledComponents';

const MyStake = () => {
  const dispatch = useDispatch();
  const handleOptionSelected = (
    option: ProposalsTypes,
  ) => {
    console.log('clicked stake');
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(setNeedsReshuffle(true));
  };
  return (
    <>
      <MainButton
        key="0"
        variant="outlined"
        className="shadow-sm rounded mr-2"
        onClick={() =>
          handleOptionSelected(ProposalsTypes.stake_tokens)
              }
      >
        <AssetActionIcon width="30px" height="30px" /> Stake
      </MainButton>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', padding: '12px 0', gap: '12px' }}>
        <MyTotalStake />
        <MyClaimableRewards />
      </Box>
      <Box>
        <AssetsTable hasStakingActions />
      </Box>
    </>
  );
};

export default MyStake;
