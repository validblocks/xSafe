import { Box } from '@mui/system';
import { network } from 'src/config';
import SearchIcon from '@mui/icons-material/Search';
import CopyButton from 'src/components/Utils/CopyButton';
import { CopyIconLink } from 'src/components/Utils/styled';
import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import {
  FinalStepActionButton,
  TextInput,
} from 'src/components/Theme/StyledComponents';
import { useRef, useState, useCallback, useMemo } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTemplateForSavingSelector } from 'src/redux/selectors/modalsSelector';
import { capitalize } from 'lodash';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { SafeApi } from 'src/services/xSafeApiProvider';
import { useAdjustedText } from 'src/hooks/useAdjustedText';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';

export enum TemplateType {
  Personal = 'personal',
  Organization = 'organization',
  Public = 'public',
}

function getTemplateTypeIcon(stringType: TemplateType): React.ReactNode {
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
    default:
      return (
        <SearchIcon sx={{ color: '#fff', height: '25px', width: '25px' }} />
      );
  }
}

export const SaveTemplateModalContent = () => {
  const { address: walletAddress } = useGetAccountInfo();

  const ownerContainerRef = useRef<HTMLDivElement>(null);
  const currentContract = useSelector(currentMultisigContractSelector);
  const selectedTemplateToSend = useSelector(selectedTemplateForSavingSelector);

  const [templateName, setTemplateName] = useState<string>(
    selectedTemplateToSend?.templateName ?? '',
  );
  const [selectedTemplateType, setSelectedTemplateType] = useState<
    TemplateType.Personal | TemplateType.Organization
  >(
    selectedTemplateToSend?.type &&
      selectedTemplateToSend?.type !== TemplateType.Public
      ? selectedTemplateToSend?.type
      : TemplateType.Personal,
  );

  const adjustedInitialOwnerAddress = useAdjustedText({
    initialText: selectedTemplateToSend?.owner ?? walletAddress,
    textToAdjust: selectedTemplateToSend?.owner,
    containerRef: ownerContainerRef,
    dependencies: [selectedTemplateToSend?.owner],
  });

  const adjustedOwnerAfterSave = useAdjustedText({
    initialText:
      selectedTemplateToSend?.type && selectedTemplateToSend?.type !== 'Public'
        ? walletAddress
        : currentContract?.address,
    textToAdjust:
      selectedTemplateType === TemplateType.Personal
        ? walletAddress
        : currentContract?.address,
    containerRef: ownerContainerRef,
    dependencies: [
      currentContract?.address,
      selectedTemplateToSend?.owner,
      selectedTemplateType,
      walletAddress,
    ],
  });

  const handleTemplateNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemplateName(e.target.value);
    },
    [],
  );

  const loginInfo = useGetLoginInfo();
  const dispatch = useDispatch();
  console.log({ loginInfo });

  const handleSaveButtonClicked = useCallback(async () => {
    await SafeApi.saveTemplate(
      {
        ownerAddress:
          selectedTemplateType === TemplateType.Personal
            ? walletAddress
            : currentContract?.address,
        templateId: selectedTemplateToSend.id,
        type: selectedTemplateType,
      },
      loginInfo.tokenLogin?.nativeAuthToken ?? '',
    );
    dispatch(setProposeModalSelectedOption(null));
  }, [
    currentContract?.address,
    dispatch,
    loginInfo.tokenLogin?.nativeAuthToken,
    selectedTemplateToSend.id,
    selectedTemplateType,
    walletAddress,
  ]);

  const templateTypeOptions: {
    key: string;
    value: TemplateType;
    displayValue: string;
    icon: React.ReactNode;
  }[] = useMemo(
    () =>
      Object.values(TemplateType)
        .map((stringType) => ({
          key: stringType,
          value: stringType,
          displayValue: capitalize(stringType),
          icon: getTemplateTypeIcon(stringType),
        }))
        .filter((item) => item.value !== TemplateType.Public),
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
          <Text>{adjustedInitialOwnerAddress}</Text>
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
      <Box mt={3}>
        <Text>After save, the owner will be</Text>
        <Box
          display={'flex'}
          my={1}
          p=".75rem 1rem"
          border="solid 1px #6B6B6B"
          borderRadius={'10px'}
          ref={ownerContainerRef}
        >
          <Text>{adjustedOwnerAfterSave}</Text>
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
              onClick={() => setSelectedTemplateType(option.value as any)}
              borderRadius={'10px'}
              sx={{
                cursor: 'pointer',
                width: '120px',
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
              <Text>{option.displayValue}</Text>
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
      <FinalStepActionButton onClick={handleSaveButtonClicked}>
        Save
      </FinalStepActionButton>
    </Box>
  );
};
