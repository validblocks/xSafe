import { Address } from '@multiversx/sdk-core/out';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/multisig/proposals/Proposals';
import { MultisigMember } from '../types/organization';

export const useMemberManipulationFunctions = () => {
  const dispatch = useDispatch();
  const onRemoveMember = (address: Address) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32(),
      }),
    );

  const onEditMember = (owner: MultisigMember) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.edit_owner,
        name: owner?.name ?? '',
        address: owner?.address ?? '',
      }),
    );

  const onAddBoardMember = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_board_member,
      }),
    );

  return {
    onRemoveMember,
    onEditMember,
    onAddBoardMember,
  };
};
