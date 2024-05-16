/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, useMediaQuery } from '@mui/material';
import { TransactionBuilderPageHeader } from 'src/components/TransactionBuilder/TransactionBuilderPageHeader';
import { TransactionBuilderMain } from 'src/components/TransactionBuilder/TransactionBuilderMain';
import { Dropzone } from 'src/components/TransactionBuilder/DropZone';
import { LOCAL_STORAGE_KEYS } from 'src/components/Marketplace/localStorageKeys';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { useCallback } from 'react';

export const TransactionBuilder = () => {
  const minWidth600 = useMediaQuery('(min-width:600px)');
  const minWidth1120 = useMediaQuery('(min-width:1120px)');

  const [localStorageAbi, setLocalStorageAbi] = useLocalStorage(
    LOCAL_STORAGE_KEYS.UPLOADED_ABI_TEXT,
    '',
  );

  const handleAbiAsTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalStorageAbi(event?.target.value);
    },
    [setLocalStorageAbi],
  );

  const updateAbiTextContent = useCallback(
    (content: string) => {
      setLocalStorageAbi(content);
    },
    [setLocalStorageAbi],
  );

  return (
    <Box>
      <TransactionBuilderPageHeader />
      <Box paddingBottom="24px" display="flex" flexWrap="wrap">
        <Box minWidth={minWidth600 ? '500px' : '100%'} maxWidth="550px">
          <TransactionBuilderMain
            abi={localStorageAbi}
            handleAbiAsTextChanged={handleAbiAsTextChanged}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          pt={minWidth1120 ? 12 : 2}
          sx={{
            minWidth: minWidth1120
              ? '320px'
              : minWidth600
              ? `min(100%, 500px)`
              : '100%',
            height: minWidth1120 ? '200px' : '120px',
            px: minWidth1120 ? 2 : 0,
          }}
        >
          <Dropzone handleTextFileContent={updateAbiTextContent} />
        </Box>
      </Box>
    </Box>
  );
};
