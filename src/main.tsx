import './init.ts';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'src/assets/sass/theme.scss';
import 'src/assets/sass/_main.scss';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
);
