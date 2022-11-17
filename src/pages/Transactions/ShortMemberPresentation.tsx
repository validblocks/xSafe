/* eslint-disable no-nested-ternary */
import { toSvg } from 'jdenticon';
import { useSelector } from 'react-redux';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { useMediaQuery } from '@mui/material';

const ShortMemberPresentation = ({ address }: { address: string }) => {
  const addressBook = useSelector(addressBookSelector);
  const maxWidth977 = useMediaQuery('(max-width: 977px)');
  const maxWidth600 = useMediaQuery('(max-width: 600px)');
  const displayAddress = () => (
    addressBook[address] ? addressBook[address] :
      maxWidth600 ? truncateInTheMiddle(address ?? 'Unknown', 12) :
        maxWidth977 ? truncateInTheMiddle(address ?? 'Unknown', 17) : address ?? 'Unknown'
  );
  return (
    <div className="d-flex align-items-center w-100">
      {address && (
        <div
          className="mr-1"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: toSvg(address, 25) }}
        />
      )}
      <Text fontSize={12}>{displayAddress()}</Text>
    </div>
  );
};

export default ShortMemberPresentation;
