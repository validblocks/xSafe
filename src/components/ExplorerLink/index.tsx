import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { network } from 'src/config';

function ExplorerLink({
  page,
  text,
  className,
}: {
  page: string;
  text?: any;
  className?: string;
}) {
  return (
    <a
      href={`${network.explorerAddress}/${page}`}
      {...{
        target: '_blank',
      }}
      className={`link-style ${className}`}
    >
      {
        text ?? <FontAwesomeIcon icon={faSearch} className="text-secondary" />
      }
    </a>
  );
}

export default ExplorerLink;
