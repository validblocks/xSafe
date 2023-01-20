import { Link, Navigate } from 'react-router-dom';
import { ReactComponent as Hero } from 'src/assets/img/home-img-multisig.svg';
import { ReactComponent as Union } from 'src/assets/img/Union.svg';
import shield from 'src/assets/img/shield-icon.svg';
import routeNames from 'src/routes/routeNames';
import { getIsLoggedIn } from '@multiversx/sdk-dapp/utils';

function Welcome() {
  const loggedIn = getIsLoggedIn();
  if (loggedIn) {
    return <Navigate to={routeNames.multisigAddress} />;
  }

  return (
    <div className="main flex-fill align-items-center container">
      <div className="row w-100">
        <div className="connect col-lg-6 col-sm-6 border-0 d-flex align-items-center">
          <div className="card-connect">
            <figure>
              <img src={shield} alt="shield-icon" width="64" height="64" />
            </figure>
            <h2 className="mb-3" data-testid="title">
              Security designed to
              <br />
              fit your needs.
            </h2>
            <p className="mb-3">
              Elrond Multisig is an ideal balance between security
              <br />
              and accessibility.
            </p>
            <p className="mb-3">
              Enabling clients to move assets seamlessly
              <br />
              and reliably, protected by multi-signature security.
            </p>
            <div className="connect-btns d-flex">
              <div className="connect-btn">
                <Link
                  to={routeNames.unlock}
                  className="btn primary mt-3"
                  data-testid="loginBtn"
                >
                  <span className="icon">
                    <Union />
                  </span>

                  <span className="name">Connect now</span>
                </Link>
              </div>
              <Link
                to={routeNames.unlock}
                className="d-flex align-items-center mt-3 info"
                data-testid="loginBtn"
              >
                What is multisig?
              </Link>
            </div>
          </div>
        </div>
        <div className="card-image col-lg-6 col-sm-6">
          <Hero className="home-img" />
        </div>
      </div>
    </div>
  );
}

export default Welcome;
