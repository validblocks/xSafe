import NftsByCollection from './NftsByCollection';
import NftsUngrouped from './NftsUngrouped';

interface IProps {
    isGroupedByCollection: boolean;
}

const NftControlledGrid = ({ isGroupedByCollection }: IProps) => (
  <div>
    {isGroupedByCollection ? <NftsByCollection /> : <NftsUngrouped />}
  </div>
);

export default NftControlledGrid;
