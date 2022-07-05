import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const Settings = () => (
  <OverlayTrigger
    trigger="click"
    placement="bottom"
    rootClose
    overlay={(
      <Popover id="settings-popover" className="basic-popover">
        <Popover.Content>
          <div className="card">
            <div className="card-body">
              <div className="theme-toggle d-flex justify-content-between align-items-center pb-3">
                <h5 className="mb-0">Settings</h5>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover>
      )}
  >
    <button className="btn btn-light mr-2">
      <FontAwesomeIcon icon={faCog} size="lg" />
    </button>
  </OverlayTrigger>
);

export default Settings;
