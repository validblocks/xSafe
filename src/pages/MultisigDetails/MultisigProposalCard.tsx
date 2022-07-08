import { Address } from '@elrondnetwork/erdjs/out';
import {
  faInfoCircle,
  faTimes,
  faThumbsUp,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useMemo } from 'react';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import MultisigDetailsContext from 'src/context/MultisigDetailsContext';
import {
  mutateSign,
  mutateUnsign,
  mutateDiscardAction,
} from 'src/contracts/MultisigContract';
import { setSelectedPerformedAction } from 'src/redux/slices/modalsSlice';

export interface MultisigProposalCardType {
  type: number;
  actionId?: number;
  tooltip?: string;
  title?: string;
  value?: string;
  canSign?: boolean;
  canUnsign?: boolean;
  canPerformAction?: boolean;
  canDiscardAction?: boolean;
  data?: string;
  signers: Address[];
  boardMembers?: Address[];
}

function MultisigProposalCard({
  type = 0,
  actionId = 0,
  data,
  tooltip = '',
  title = '',
  value = '0',
  canSign = false,
  canUnsign = false,
  canPerformAction = false,
  canDiscardAction = false,
  boardMembers,
  signers = [],
}: MultisigProposalCardType) {
  const { quorumSize } = useContext(MultisigDetailsContext);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const validatedSigners = useMemo(() => {
    if (boardMembers == null) {
      return signers;
    }
    return signers.filter((signer) =>
      boardMembers.some((boardMember) => boardMember.equals(signer)));
  }, [signers, boardMembers]);

  const sign = () => {
    mutateSign(actionId);
  };

  const unsign = () => {
    mutateUnsign(actionId);
  };

  const performAction = () => {
    dispatch(setSelectedPerformedAction({ id: actionId, actionType: type }));
  };

  const discardAction = () => {
    mutateDiscardAction(actionId);
  };
  return (
    <div className="statcard text-black py-3 px-4 mb-spacer">
      <div className="d-flex proposal">
        <div className="meta">
          <p className="h5 mb-0">
            {title}
            {tooltip !== '' ? (
              <FontAwesomeIcon
                style={{ width: 16, height: 16, marginBottom: 2 }}
                icon={faInfoCircle}
                className="text-black ml-2"
                data-toggle="tooltip"
                data-html="true"
                title={tooltip}
              />
            ) : null}
          </p>
          <span className="text">{value}</span>
          {data != null && (
            <div className="data-field">
              <p className="mb-0">Data</p>
              <textarea
                disabled
                value={data}
                className="form-control data-textarea mb-0"
              />
            </div>
          )}
        </div>

        <div className="d-flex align-items-center btns action-btns">
          {canSign && (
            <button onClick={sign} className="btn action sign btn--approve">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>
                {t('Approve') as string}
              </span>
            </button>
          )}
          {canUnsign && (
            <button onClick={unsign} className="btn action unsign btn--discard">
              <FontAwesomeIcon icon={faTimes} />
              <span>{t('Withdraw') as string}</span>
            </button>
          )}
          {canPerformAction && (
            <button
              style={{ whiteSpace: 'nowrap' }}
              onClick={performAction}
              className="btn action perform btn--approve"
            >
              <FontAwesomeIcon icon={faCheck} />
              {t('Perform') as string}
            </button>
          )}
          {canDiscardAction && (
            <button
              style={{ whiteSpace: 'nowrap' }}
              onClick={discardAction}
              className="btn action remove btn--discard"
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('Discard') as string}
            </button>
          )}
        </div>
        <div className="circular-progress-bar">
          <div style={{ width: 72, height: 72 }} className="">
            <CircularProgressbarWithChildren
              value={validatedSigners.length}
              maxValue={quorumSize}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathColor: '#4c2ffc',
              })}
            >
              <div>{`${validatedSigners.length} / ${quorumSize}`}</div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultisigProposalCard;
