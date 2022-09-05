import {
  Accordion,
  Card,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import StatCard from 'src/components/StatCard';
import { ContractInfo } from '../MultisigDetailsPage';

import './multisigDetailsAccordion.scss';

interface MultisigDetailsAccordionPropsType {
  contractInfo: Partial<ContractInfo>;
}

function MultisigDetailsAccordion({
  contractInfo,
}: MultisigDetailsAccordionPropsType) {
  const {
    totalBoardMembers,
    quorumSize,
  } = contractInfo;

  const { t }: { t: any } = useTranslation();

  // const onAddBoardMember = () =>
  //   dispatch(
  //     setProposeModalSelectedOption({
  //       option: ProposalsTypes.add_board_member,
  //     }),
  //   );
  // const onAddProposers = () =>
  //   dispatch(
  //     setProposeModalSelectedOption({
  //       option: ProposalsTypes.add_proposer,
  //     }),
  //   );
  // const onRemoveUser = (address: Address) =>
  //   dispatch(
  //     setProposeModalSelectedOption({
  //       option: ProposalsTypes.remove_user,
  //       address: address.bech32(),
  //     }),
  //   );
  // const onChangeQuorum = () =>
  //   dispatch(
  //     setProposeModalSelectedOption({
  //       option: ProposalsTypes.change_quorum,
  //     }),
  //   );

  // const boardMembersExceedQuorumSize = totalBoardMembers > quorumSize;

  // const renderAddress = (
  //   address: Address,
  //   index: number,
  //   isBoardMember = false,
  // ) =>
  // const canRemoveUser = !isBoardMember || boardMembersExceedQuorumSize;

  // const removeButton = isProposer && (
  //   <button
  //     disabled={!canRemoveUser}
  //     onClick={() => onRemoveUser(address)}
  //     className={`action-remove action remove ${
  //       canRemoveUser ? '' : 'disabled'
  //     }`}
  //   >
  //     <FontAwesomeIcon icon={faMinus} />
  //     <span className="name">Remove</span>
  //   </button>
  // );

  // const removeButtonContainer = !canRemoveUser ? (
  //   <OverlayTrigger
  //     placement="top"
  //     delay={{ show: 50, hide: 50 }}
  //     trigger="click"
  //     // eslint-disable-next-line react/no-unstable-nested-components
  //     overlay={(props) => (
  //       <Tooltip id={`remove-user-tooltip-${index}`} {...props}>
  //         {t('Insufficient quorum size for removing a board member')}
  //       </Tooltip>
  //     )}
  //   >
  //     <div className="d-inline-block">{removeButton}</div>
  //   </OverlayTrigger>
  // ) : (
  //   removeButton
  // );

  // (
  //   <Card.Header key={address.bech32()}>
  //     <div className="user-item">
  //       <span className="address text d-flex">
  //         <Ui.Trim text={address.bech32()} />
  //         <a
  //           href={`${network.explorerAddress}/accounts/${address.bech32()}`}
  //           target="_blank"
  //           rel="noreferrer"
  //           className="link-second-style  ml-2"
  //         >
  //           <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
  //         </a>
  //       </span>

  //       <div className="btns">{removeButtonContainer}</div>
  //     </div>
  //   </Card.Header>
  // )
  // ;

  // const boardMembersContent = boardMembersAddresses != null && (
  //   <div className="actions-card boards-members-content">
  //     {/* <Card.Header>
  //       <span className="h5">Board Members</span>
  //       {isProposer && (
  //         <div className="btns">
  //           <button
  //             onClick={onAddBoardMember}
  //             className="btn action-add action unsign"
  //           >
  //             <FontAwesomeIcon icon={faPlus} />
  //             <span className="name">Add member</span>
  //           </button>
  //           <button
  //             onClick={onChangeQuorum}
  //             className="btn action-add action unsign"
  //           >
  //             <FontAwesomeIcon icon={faPencilAlt} />
  //             <span className="name">Edit quorum</span>
  //           </button>
  //         </div>
  //       )}
  //     </Card.Header> */}

  //     {Object.keys(boardMembersAddresses).length > 0 ? (
  //       <Card.Body>
  //         {boardMembersAddresses.map((address, index) =>
  //           renderAddress(address, index, true))}
  //       </Card.Body>
  //     ) : (
  //       <div className=" w-100 no-active-proposals">
  //         <p className="d-flex flex-column align-items-center mb-3">
  //           <EmptyStateIcon className=" " />
  //           {t('Currently there are no proposers.')}
  //         </p>
  //       </div>
  //     )}
  //   </div>
  // );

  // const proposersContent = proposersAddresses != null && (
  //   <div className="actions-card proposals-content">
  //     <Card.Header>
  //       <span className="h5">Proposers</span>
  //       {isProposer && (
  //         <div className="btns">
  //           <button
  //             onClick={onAddProposers}
  //             className="action-add action unsign"
  //           >
  //             <FontAwesomeIcon icon={faPlus} />
  //             <span className="name">Add proposer</span>
  //           </button>
  //         </div>
  //       )}
  //     </Card.Header>
  //     {Object.keys(proposersAddresses).length > 0 ? (
  //       <Card.Body>
  //         {proposersAddresses.map((address, index) =>
  //           renderAddress(address, index))}
  //       </Card.Body>
  //     ) : (
  //       <div className=" w-100 no-active-proposals">
  //         <p className="d-flex flex-column align-items-center mb-3">
  //           <EmptyStateIcon className=" " />
  //           {t('Currently there are no proposers.')}
  //         </p>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <Accordion className="multisig-details-accordion">
      <Accordion.Toggle
        as={Card}
        eventKey="0"
        className="cards d-flex flex-wrap border-n"
      >
        <StatCard
          title={t('Owners')}
          value={totalBoardMembers?.toString() ?? '0'}
        />
        <StatCard
          title={t('Quorum Size')}
          value={`${quorumSize?.toString() ?? '0'}/${totalBoardMembers} `}
        />
      </Accordion.Toggle>

      {/* <Accordion.Toggle
        eventKey="0"
        onClick={decoratedOnClick}
        className="expand-icon"
      >
        <FontAwesomeIcon
          icon={expanded ? faChevronCircleUp : faChevronCircleDown}
        />
      </Accordion.Toggle> */}

    </Accordion>
  );
}

export default MultisigDetailsAccordion;
