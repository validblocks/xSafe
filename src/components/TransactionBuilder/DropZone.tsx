import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Text } from '../StyledComponents/StyledComponents';
import { SettingsWrapper } from '../Settings/settings-style';
import { Typography } from '@mui/material';
import { useCustomTheme } from 'src/hooks/useCustomTheme';

interface IDropZoneProps {
  handleTextFileContent: (content: string) => void;
}

export const Dropzone = ({ handleTextFileContent }: IDropZoneProps) => {
  const theme = useCustomTheme();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          const textFileContent = reader.result?.toString();

          if (textFileContent) handleTextFileContent(textFileContent);
        };
        reader.readAsText(file);
      });
    },
    [handleTextFileContent],
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <SettingsWrapper
      sx={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23797785FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");`,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Text sx={{ cursor: 'pointer', color: theme.palette.text.menuItems }}>
        Drag and drop a JSON file or{' '}
        <Typography component="span" sx={{ color: theme.palette.text.primary }}>
          choose a file
        </Typography>
      </Text>
    </SettingsWrapper>
  );
};
