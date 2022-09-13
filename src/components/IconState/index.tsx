import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function IconState({
  icon,
  className = '',
  iconSize = '3x',
}: {
  icon: any;
  className?: string;
  iconSize?: '2x' | '3x' | '5x';
}) {
  return (
    <span
      className={`icon-state mx-auto ${className} ${
        iconSize === '2x' ? 'half' : ''
      }`}
    >
      <FontAwesomeIcon
        icon={icon}
        size={iconSize}
        className={className ? `${className} text-white` : 'text-primary'}
      />
    </span>
  );
}

export default IconState;
