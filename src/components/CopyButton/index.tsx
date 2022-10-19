import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { MouseEvent, useState } from 'react';
import copyTextToClipboard from './helpers/copyToClipboard';
import * as Styled from '../Utils/styled/index';

interface CopyButtonType {
  text: string;
  className?: string;
  color?: 'grey' | 'purple' | string;
}

const CopyButton = ({ text, color = '', className = '' }: CopyButtonType) => {
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

  if (color === 'grey') {
    return (
      <Styled.CopyIconLink
        href="/#"
        onClick={handleCopyToClipboard}
        className={`side-action ${className}`}
      >
        {copyResult.default || !copyResult.success ? (
          <ContentCopyRoundedIcon />
        ) : (
          <FontAwesomeIcon icon={faCheck} className="text-primary-highlight" />
        )}
      </Styled.CopyIconLink>
    );
  }
  if (color === 'purple') {
    return (
      <Styled.CopyIconLinkPurple
        href="/#"
        onClick={handleCopyToClipboard}
        className={`side-action ${className}`}
      >
        {copyResult.default || !copyResult.success ? (
          <ContentCopyRoundedIcon />
        ) : (
          <FontAwesomeIcon icon={faCheck} className="text-primary-highlight" />
        )}
      </Styled.CopyIconLinkPurple>
    );
  }

  return (
    <Styled.CopyIconLink
      href="/#"
      onClick={handleCopyToClipboard}
      className={`side-action ${className}`}
    >
      {copyResult.default || !copyResult.success ? (
        <ContentCopyRoundedIcon />
      ) : (
        <FontAwesomeIcon icon={faCheck} className="text-primary-highlight" />
      )}
    </Styled.CopyIconLink>
  );
};

export default CopyButton;
