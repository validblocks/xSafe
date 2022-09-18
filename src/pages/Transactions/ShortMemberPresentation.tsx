import { Ui } from '@elrondnetwork/dapp-utils';
import { toSvg } from 'jdenticon';
import { useSelector } from 'react-redux';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';

const ShortMemberPresentation = ({ address }: { address: string }) => {
  const addressBook = useSelector(addressBookSelector);
  return (
    <div className="d-flex align-items-center w-100 mt-1">
      {address && (
        <div
          className="mr-1"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: toSvg(address, 25) }}
        />
      )}
      <Ui.Trim text={addressBook[address] ?? address ?? 'Unknown'} />
    </div>
  );
};

export default ShortMemberPresentation;
