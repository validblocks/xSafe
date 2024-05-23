import { Box } from '@mui/system';
import { network } from 'src/config';
import SearchIcon from '@mui/icons-material/Search';
import CopyButton from 'src/components/Utils/CopyButton';
import { CopyIconLink } from 'src/components/Utils/styled';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import {
  FinalStepActionButton,
  TextInput,
} from 'src/components/Theme/StyledComponents';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { adjustTextByWidth } from 'src/utils/stringUtils';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import { useSelector } from 'react-redux';
import { selectedTemplateToSendSelector } from 'src/redux/selectors/modalsSelector';

enum TemplateType {
  Personal = 'Personal',
  Organization = 'Organization',
  Public = 'Public',
}

function getTemplateTypeIcon(stringType: TemplateType): any {
  switch (stringType) {
    case TemplateType.Personal:
      return (
        <PersonIcon sx={{ color: '#fff', height: '25px', width: '25px' }} />
      );
    case TemplateType.Organization:
      return (
        <MapsHomeWorkRoundedIcon
          sx={{ color: '#fff', height: '25px', width: '25px' }}
        />
      );
    case TemplateType.Public:
      return (
        <PublicIcon sx={{ color: '#fff', height: '25px', width: '25px' }} />
      );
    default:
      return (
        <SearchIcon sx={{ color: '#fff', height: '25px', width: '25px' }} />
      );
  }
}

export const SaveTemplateModalContent = () => {
  const { address: walletAddress } = useGetAccountInfo();

  const ownerContainerRef = useRef<HTMLDivElement>(null);
  const selectedTemplateToSend = useSelector(selectedTemplateToSendSelector);

  const [templateName, setTemplateName] = useState<string>(
    selectedTemplateToSend?.templateName ?? '',
  );
  const [selectedTemplateType, setSelectedTemplateType] =
    useState<TemplateType>(
      selectedTemplateToSend?.type ?? TemplateType.Personal,
    );
  const [adjustedOwnerAddress, setAdjustedOwnerAddress] = useState<string>(
    selectedTemplateToSend?.owner ?? walletAddress,
  );

  // const _onSelectedTemplateTypeChanged = useCallback(
  //   (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setSelectedTemplateType(e.target.value as TemplateType);
  //   },
  //   [],
  // );

  useEffect(() => {
    if (ownerContainerRef.current) {
      setAdjustedOwnerAddress(
        adjustTextByWidth({
          text: selectedTemplateToSend?.owner,
          containerWidth: ownerContainerRef.current?.offsetWidth ?? 0,
          containerPadding2X: 25,
        }),
      );
    }
  }, [ownerContainerRef, selectedTemplateToSend?.owner]);

  const handleTemplateNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemplateName(e.target.value);
    },
    [],
  );

  const templateTypeOptions = useMemo(
    () =>
      Object.values(TemplateType).map((stringType) => ({
        key: stringType,
        value: stringType,
        icon: getTemplateTypeIcon(stringType),
      })),
    [],
  );

  return (
    <Box>
      <Box>
        <Text>Creator address</Text>
        <Box
          display={'flex'}
          my={1}
          p=".75rem 1rem"
          border="solid 1px #6B6B6B"
          borderRadius={'10px'}
          ref={ownerContainerRef}
        >
          <Text>{adjustedOwnerAddress}</Text>
          <Box sx={{ mx: 1.35 }}>
            <CopyButton text={walletAddress} link={CopyIconLink} />
          </Box>
          <Box>
            <Anchor
              href={`${network.explorerAddress}/accounts/${walletAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <SearchIcon sx={{ color: '#6C757D !important' }} />
            </Anchor>
          </Box>
        </Box>
      </Box>
      <Box my={4}>
        <Text mb={1}>Template type</Text>
        <Box display="flex" width="100%" gap={2}>
          {templateTypeOptions.map((option) => (
            <Box
              key={option.key}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              px={2}
              py={3}
              onClick={() => setSelectedTemplateType(option.value)}
              borderRadius={'10px'}
              sx={{
                cursor: 'pointer',
                flex: 1,
                border:
                  selectedTemplateType === option.value
                    ? '1px solid #4c2ffc'
                    : 'solid 1px #6B6B6B',

                backgroundColor:
                  selectedTemplateType === option.value
                    ? '#4c2ffc0f'
                    : 'transparent',
              }}
            >
              <Box mb={1}>{option.icon}</Box>
              <Text>{option.value}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      <Box my={4}>
        <TextInput
          placeholder="Enter template name"
          label="Template name"
          value={templateName}
          autoComplete="off"
          onChange={handleTemplateNameChange}
        />
      </Box>
      <FinalStepActionButton onClick={() => null}>Save</FinalStepActionButton>
    </Box>
  );
};
