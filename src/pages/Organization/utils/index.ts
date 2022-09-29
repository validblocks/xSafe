import { Address } from '@elrondnetwork/erdjs/out';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { Owner } from '../types';

export const useOwnerManipulationFunctions = () => {
  const dispatch = useDispatch();
  const onRemoveUser = (address: Address) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32(),
      }),
    );

  const onEditOwner = (owner: Owner) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.edit_owner,
        name: owner.name,
        address: new Address(owner.address).bech32(),
      }),
    );

  const onReplaceOwner = (owner: Owner) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.replace_owner,
        currentOwner: owner,
      }),
    );

  const onAddBoardMember = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_board_member,
      }),
    );

  return {
    onRemoveUser,
    onEditOwner,
    onReplaceOwner,
    onAddBoardMember,
  };
};
