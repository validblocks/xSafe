import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { Link } from '@mui/material';
import { useTheme } from 'styled-components';
import { MouseEvent, useState } from 'react';
import copyTextToClipboard from './helpers/copyToClipboard';

interface CopyButtonType {
  text: string;
  className?: string;
}

const CopyButton = ({ text, className = '' }: CopyButtonType) => {
  const theme: any = useTheme();
  const [copyResult, setCopyResut] = useState({
    default: true,
    success: false,
  });

  const handleCopyToClipboard = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const noSpaces = text ? text.trim() : text;
    setCopyResut({
      default: false,
      success: await copyTextToClipboard(noSpaces),
    });

    setTimeout(() => {
      setCopyResut({
        default: true,
        success: false,
      });
    }, 1000);
  };

  return (
    <Link
      href="/#"
      onClick={handleCopyToClipboard}
      className={`side-action ${className}`}
      sx={{
        '& .text-secondary': {
          color: '#6c757d !important',
        },
        '& .copyIcon': {
          color: '#4c2ffc8a !important',
        },
        '& svg': {
          color: `${theme.palette.button.copy} !important`,
        },
      }}
    >
      {copyResult.default || !copyResult.success ? (
        <CopyAllIcon />
      ) : (
        <FontAwesomeIcon icon={faCheck} className="text-primary-highlight" />
      )}
    </Link>
  );
};

export default CopyButton;
