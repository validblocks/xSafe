import { ReactComponent as HeartIcon } from 'src/assets/img/heart.svg';

const Footer = () => (
  <footer className="text-center mt-2 mb-3">
    <div>
      <a
        {...{
          target: '_blank',
        }}
        className="d-flex align-items-center"
        href="https://multiversx.com/"
      >
        Made with
        {' '}
        <HeartIcon className="mx-1" />
        {' '}
        by MultiversX.
      </a>
    </div>
  </footer>
);

export default Footer;
