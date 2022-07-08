import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function State({
  icon,
  iconClass,
  title,
  description,
  action,
}: {
  icon?: any;
  iconClass?: string;
  title?: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="state m-auto p-spacer text-center">
      {icon && (
        <FontAwesomeIcon icon={icon} className={iconClass || ''} size="5x" />
      )}
      {title && <p className="h4 mt-2 mb-1">{title}</p>}
      {description && <div className="mb-3">{description}</div>}
      {action && <div>{action}</div>}
    </div>
  );
}

export default State;
