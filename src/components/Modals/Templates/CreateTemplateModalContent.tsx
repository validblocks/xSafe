import { Box, Chip } from '@mui/material';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import PublicIcon from '@mui/icons-material/Public';

import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import CopyButton from 'src/components/Utils/CopyButton';
import { CopyIconLink } from 'src/components/Utils/styled';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import {
  FinalStepActionButton,
  TextInput,
} from 'src/components/Theme/StyledComponents';
import { useAdjustedText } from 'src/hooks/useAdjustedText';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { selectedTemplateForCreationSelector } from 'src/redux/selectors/modalsSelector';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { SafeApi } from 'src/services/xSafeApiProvider';
import { network } from 'src/config';
import { Address } from '@multiversx/sdk-core/out';

const MIN_TEMPLATE_NAME_LENGTH = 5;

export enum TemplateType {
  Personal = 'personal',
  Organization = 'organization',
  Public = 'public',
}

interface TemplateTypeOption {
  key: string;
  value: TemplateType;
  displayValue: string;
  icon: React.ReactNode;
}

function getTemplateTypeIcon(stringType: TemplateType): React.ReactNode {
  const iconProps = { sx: { color: '#fff', height: '25px', width: '25px' } };
  switch (stringType) {
    case TemplateType.Personal:
      return <PersonIcon {...iconProps} />;
    case TemplateType.Organization:
      return <MapsHomeWorkRoundedIcon {...iconProps} />;
    case TemplateType.Public:
      return <PublicIcon {...iconProps} />;
    default:
      return <SearchIcon {...iconProps} />;
  }
}

interface TemplateTypeSelectorProps {
  templateTypeOptions: TemplateTypeOption[];
  selectedTemplateType: TemplateType;
  setSelectedTemplateType: React.Dispatch<React.SetStateAction<TemplateType>>;
}

const TemplateTypeSelector: React.FC<TemplateTypeSelectorProps> = ({
  templateTypeOptions,
  selectedTemplateType,
  setSelectedTemplateType,
}) => (
  <Box>
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
          borderRadius="10px"
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
);

interface AddressPresenterProps {
  label: string;
  prettyAddress: string;
  refContainer: React.RefObject<HTMLDivElement>;
  fullAddress: string;
}

const AddressPresenter: React.FC<AddressPresenterProps> = ({
  label,
  prettyAddress,
  refContainer,
  fullAddress,
}) => (
  <Box mt={2}>
    <Text>{label}</Text>
    <Box
      display="flex"
      my={1}
      p=".75rem 1rem"
      border="solid 1px #6B6B6B"
      borderRadius="10px"
      ref={refContainer}
    >
      <Text>{prettyAddress}</Text>
      <Box sx={{ mx: 1.35 }}>
        <CopyButton text={fullAddress} link={CopyIconLink} />
      </Box>
      <Box>
        <Anchor
          href={`${network.explorerAddress}/accounts/${fullAddress}`}
          target="_blank"
          rel="noreferrer"
        >
          <SearchIcon sx={{ color: '#6C757D !important' }} />
        </Anchor>
      </Box>
    </Box>
  </Box>
);

export const CreateTemplateModalContent: React.FC = () => {
  const theme = useCustomTheme();
  const dispatch = useDispatch();
  const { address: walletAddress } = useGetAccountInfo();
  const ownerContainerRef = useRef<HTMLDivElement>(null);
  const receiverContainerRef = useRef<HTMLDivElement>(null);
  const currentContract = useSelector(currentMultisigContractSelector);
  const selectedTemplateForCreation = useSelector(
    selectedTemplateForCreationSelector,
  );
  const [templateName, setTemplateName] = useState(
    selectedTemplateForCreation?.templateName ?? '',
  );
  const [selectedTemplateType, setSelectedTemplateType] =
    useState<TemplateType>(TemplateType.Personal);
  const loginInfo = useGetLoginInfo();

  const prettyOwner = useAdjustedText({
    initialText:
      selectedTemplateForCreation?.type &&
      selectedTemplateForCreation?.type !== 'Public'
        ? walletAddress
        : currentContract?.address,
    textToAdjust:
      selectedTemplateType === TemplateType.Personal
        ? walletAddress
        : currentContract?.address,
    containerRef: ownerContainerRef,
    dependencies: [
      currentContract?.address,
      selectedTemplateForCreation?.owner,
      selectedTemplateType,
      walletAddress,
    ],
  });

  const prettyReceiver = useAdjustedText({
    initialText:
      selectedTemplateForCreation?.receiver ?? 'No receiver provided',
    textToAdjust:
      selectedTemplateForCreation?.receiver ?? 'No receiver provided',
    containerRef: receiverContainerRef,
    dependencies: [selectedTemplateForCreation?.receiver],
  });

  const handleTemplateNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemplateName(e.target.value);
    },
    [],
  );

  const handleSaveButtonClicked = useCallback(async () => {
    await SafeApi.createTemplate(
      {
        owner:
          selectedTemplateType === TemplateType.Personal
            ? walletAddress
            : currentContract?.address,
        endpoint: selectedTemplateForCreation?.endpoint,
        params: selectedTemplateForCreation?.params,
        receiver: selectedTemplateForCreation?.receiver,
        value: selectedTemplateForCreation?.value,
        templateName,
        description: '',
        type: selectedTemplateType,
      },
      loginInfo.tokenLogin?.nativeAuthToken ?? '',
    );
    dispatch(setProposeModalSelectedOption(null));
  }, [
    currentContract?.address,
    dispatch,
    loginInfo.tokenLogin?.nativeAuthToken,
    selectedTemplateForCreation?.endpoint,
    selectedTemplateForCreation?.params,
    selectedTemplateForCreation?.receiver,
    selectedTemplateForCreation?.value,
    selectedTemplateType,
    templateName,
    walletAddress,
  ]);

  const templateTypeOptions = useMemo(
    () =>
      Object.values(TemplateType).map((stringType) => ({
        key: stringType,
        value: stringType,
        displayValue: capitalize(stringType),
        icon: getTemplateTypeIcon(stringType),
      })),
    [],
  );

  const isCreateTemplateButtonDisabled = useMemo(() => {
    const { receiver, endpoint, params, value } = selectedTemplateForCreation;
    const owner =
      selectedTemplateType === TemplateType.Personal
        ? walletAddress
        : currentContract?.address;

    return (
      !templateName ||
      templateName.length < MIN_TEMPLATE_NAME_LENGTH ||
      !owner ||
      !Address.isValid(owner) ||
      !receiver ||
      !Address.isValid(receiver) ||
      !endpoint ||
      !params ||
      value === undefined ||
      value === null ||
      value === ''
    );
  }, [
    currentContract?.address,
    selectedTemplateForCreation,
    selectedTemplateType,
    templateName,
    walletAddress,
  ]);

  return (
    <Box>
      <TemplateTypeSelector
        templateTypeOptions={templateTypeOptions}
        selectedTemplateType={selectedTemplateType}
        setSelectedTemplateType={setSelectedTemplateType}
      />
      <Box mt={4}>
        <TextInput
          placeholder="Enter template name (5+ characters)"
          label="Template name"
          value={templateName}
          autoComplete="off"
          onChange={handleTemplateNameChange}
        />
      </Box>
      <AddressPresenter
        label="Template Owner"
        prettyAddress={prettyOwner}
        refContainer={ownerContainerRef}
        fullAddress={walletAddress}
      />
      <AddressPresenter
        label="Receiver"
        prettyAddress={prettyReceiver}
        refContainer={receiverContainerRef}
        fullAddress={walletAddress}
      />
      <Box mt={2}>
        <Text
          fontSize="15px"
          sx={{ opacity: 0.5 }}
          fontWeight="400 !important"
          mb={1}
        >
          Arguments
        </Text>
        {selectedTemplateForCreation.params.length > 0 ? (
          <Box mb={0.25}>
            {selectedTemplateForCreation.params?.map(
              (param: string, idx: number) => (
                <Chip
                  key={idx}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: '#4c2ffc',
                    px: 1,
                    mb: 0.5,
                    mr: 0.5,
                  }}
                  variant="outlined"
                  label={param}
                />
              ),
            )}
          </Box>
        ) : (
          <Text>No arguments provided.</Text>
        )}
      </Box>
      <Box mt={4}>
        <FinalStepActionButton
          disabled={isCreateTemplateButtonDisabled}
          onClick={handleSaveButtonClicked}
        >
          Create template
        </FinalStepActionButton>
      </Box>
    </Box>
  );
};
