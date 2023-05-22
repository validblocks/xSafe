import IssueNftCollectionProposalPresentation from './IssueNftCollectionProposalPresentation';

type Props = {
  parsedArgs: {
    properties: Record<string, boolean>;
    tokenTicker: string;
    tokenName: string;
  }
};

const IssueSftCollectionProposalPresentation = ({ parsedArgs }: Props) => (
  <IssueNftCollectionProposalPresentation
    parsedArgs={parsedArgs}
  />
);

export default IssueSftCollectionProposalPresentation;
