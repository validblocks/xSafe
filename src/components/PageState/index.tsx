import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PageState({
  icon,
  iconClass,
  iconBgClass,
  iconSize = '5x',
  containerClass = '',
  title,
  description,
  action,
  dataTestId,
}: {
  icon?: IconProp;
  iconClass?: string;
  iconBgClass?: string;
  dataTestId?: string;
  iconSize?: SizeProp;
  containerClass?: string;
  title?: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`state m-auto p-spacer text-center ${containerClass}`}
      data-testid={dataTestId}
    >
      {icon && (
        <span className={`icon-state mx-auto ${iconBgClass || ''}`}>
          <FontAwesomeIcon
            icon={icon}
            className={iconClass || ''}
            size={iconSize}
          />
        </span>
      )}
      {title && <p className="h4 mt-spacer mb-3">{title}</p>}
      {description && <div className="mb-spacer">{description}</div>}
      {action && <div>{action}</div>}
    </div>
  );
}

export default PageState;
