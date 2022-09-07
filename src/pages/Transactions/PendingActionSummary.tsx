import { Ui } from '@elrondnetwork/dapp-utils';
import PeopleIcon from '@mui/icons-material/People';
import { Box } from '@mui/system';
import { toSvg } from 'jdenticon';
import { useSelector } from 'react-redux';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { useTheme } from 'styled-components';

type Props = {
  action: MultisigActionDetailed;
};

const PendingActionSummary = ({ action }: Props) => {
  const {
    quorumCountState: [quorumCount],
  } = useOrganizationInfoContext();

  const addressBook = useSelector(addressBookSelector);

  const theme: any = useTheme();
  return (
    <>
      <Box className="d-flex">
        <Box
          className="d-flex align-items-center justify-content-center w-100"
          sx={{
            borderRight: '1px solid #D6DAF1',
            padding: '1rem',
            minWidth: '60px',
          }}
        >
          {action?.actionId}
        </Box>

        <Box
          className="d-flex align-items-center justify-content-start"
          sx={{
            borderRight: '1px solid #D6DAF1',
            padding: '1rem',
            fontWeight: 'bold',
            minWidth: '230px',
          }}
        >
          {action?.title()}
        </Box>

        <Box
          sx={{
            borderRight: '1px solid #D6DAF1',
            padding: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            minWidth: '150px',
          }}
        >
          <PeopleIcon htmlColor={theme.palette.primary.dark} className="mr-2" />
          <Text fontWeight={500} fontSize={14}>
            {action.signers.length} out of {quorumCount}
          </Text>
        </Box>

        <Box
          sx={{
            padding: '1rem',
            fontSize: '0.85rem',
            minWidth: '250px',
            flex: 1,
          }}
        >
          <Text fontWeight={500} fontSize={14}>
            Created by:
          </Text>
          <div className="d-flex align-items-center w-100 mt-1">
            {action.signers[0]?.bech32() && (
            <div
              className="mr-1"
              dangerouslySetInnerHTML={{ __html: toSvg(action.signers[0]?.bech32(), 25) }}
            />
            )}
            <Ui.Trim text={addressBook[action.signers[0]?.bech32()] ?? action.signers[0]?.bech32() ?? 'Unknown'} />
          </div>
        </Box>
      </Box>
      <Box
        className="d-flex"
        sx={{
          borderLeft: '1px solid #D6DAF1',
          padding: '1rem',
          fontSize: '0.85rem',
        }}
      >
        <div className="mx-3 d-flex align-items-center justify-content-end">
          <Box
            sx={{
              backgroundColor: '#f8c651',
              color: '#fff',
              borderRadius: '4px',
              padding: '0.5rem 0.675rem',
              fontWeight: 'bold',
            }}
          >
            Pending
          </Box>
        </div>
      </Box>
    </>
  );
};

export default PendingActionSummary;
