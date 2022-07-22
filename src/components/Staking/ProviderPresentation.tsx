import { IProvider } from 'src/types/staking';

interface Props {
    provider: IProvider
}

const ProviderPresentation = ({ provider }: Props) => {
  console.log('provider');
  return (
    <div>
      {provider.identity}
    </div>
  );
};

export default ProviderPresentation;
