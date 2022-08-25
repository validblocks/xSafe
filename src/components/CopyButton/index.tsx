import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { MouseEvent, useState } from 'react';
import copyTextToClipboard from './helpers/copyToClipboard';

interface CopyButtonType {
  text: string;
  className?: string;
}

const CopyButton = ({ text, className = '' }: CopyButtonType) => {
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
    <a
      href="/#"
      onClick={handleCopyToClipboard}
      className={`side-action text-secondary ${className}`}
    >
      {copyResult.default || !copyResult.success ? (
        <CopyAllIcon />
      ) : (
        <FontAwesomeIcon icon={faCheck} className="text-primary-highlight" />
      )}
    </a>
  );
};

export default CopyButton;
