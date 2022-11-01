import { Ui } from '@elrondnetwork/dapp-utils';
import { toSvg } from 'jdenticon';
import { useSelector } from 'react-redux';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { Text } from 'src/components/StyledComponents/StyledComponents';

const ShortMemberPresentation = ({ address }: { address: string }) => {
  const addressBook = useSelector(addressBookSelector);
  return (
    <div className="d-flex align-items-center w-100">
      {address && (
        <div
          className="mr-1"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: toSvg(address, 25) }}
        />
      )}
      <Text fontSize={12}><Ui.Trim text={addressBook[address] ?? address ?? 'Unknown'} /></Text>
    </div>
  );
};

export default ShortMemberPresentation;
