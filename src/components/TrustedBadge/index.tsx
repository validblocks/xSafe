import './trustedBadge.scss';
import { getIsContractTrusted } from 'src/apiCalls/multisigContractsCalls';

import TrustedBadgeIcon from 'src/assets/img/trusted-badge.svg';
import { useEffect, useState } from 'react';

interface TrustedBadgePropsType {
  contractAddress?: string;
  initialValue?: boolean;
  onVerificationComplete?: (trusted: boolean) => void;
}

const TrustedBadge = ({
  contractAddress,
  initialValue,
  onVerificationComplete,
}: TrustedBadgePropsType) => {
  const [isTrusted, setIsTrusted] = useState(initialValue);

  async function validateContractHash() {
    const isContractTrusted = await getIsContractTrusted(contractAddress);
    setIsTrusted(isContractTrusted);
    onVerificationComplete?.(isContractTrusted);
  }

  useEffect(() => {
    if (contractAddress != null) {
      validateContractHash();
    }
  }, [contractAddress]);

  if (!isTrusted) return <span>Not trusted</span>;

  return (
    isTrusted && (
      <span className="trust-badge">
        <img src={TrustedBadgeIcon} alt="trusted-badge" />
      </span>
    )
  );
};

export default TrustedBadge;
