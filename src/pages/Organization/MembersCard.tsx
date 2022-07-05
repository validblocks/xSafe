import FactCheckIcon from '@mui/icons-material/FactCheck';
import GroupsIcon from '@mui/icons-material/Groups';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MembersCountInfoCard from './MembersCountInfoCard';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';

const MembersCard = () => {
  const {
    membersCountState: [membersCount],
    quorumCountState: [quorumCount],
    proposersState: [proposers],
    boardMembersState: [boardMembers],
  } = useOrganizationInfoContext();

  const { t } = useTranslation();

  const memberTypes = [
    {
      icon: <GroupsIcon htmlColor="#dc3545" fontSize="medium" />,
      memberTypeTitle: t('Board Members'),
      memberCount: boardMembers.length.toString(),
    },
    {
      icon: <ThumbUpIcon htmlColor="#16d296" fontSize="medium" />,
      memberTypeTitle: t('Proposers'),
      memberCount: proposers.length.toString(),
    },
    {
      icon: <FactCheckIcon htmlColor="#1390ff" fontSize="medium" />,
      memberTypeTitle: t('Quorum Size'),
      memberCount: `${quorumCount.toString()}/${
        proposers.length + boardMembers.length
      }`,
    },
  ];

  return (
    <div className="total-members__container">
      <div className="bg-light px-5 py-5">
        <Grid container justifyContent="center" alignItems="center">
          <Grid
            className="d-flex align-items-center justify-content-center"
            item
            xs={6}
          >
            <div>
              <h1 className="mr-4 mb-0 d-flex align-items-center justify-content-center">
                {membersCount}
              </h1>
              <h3 className="mb-0 d-flex justify-content-center align-items-center">
                {`$${t('Total members')}`}
              </h3>
            </div>
          </Grid>
          <Grid item className="d-flex justify-content-center" xs={6}>
            <img
              src="https://picsum.photos/150/150?random=1"
              alt="Total members"
              className="rounded"
            />
          </Grid>
        </Grid>
      </div>
      <div className="px-5 py-5">
        <Grid container direction="column">
          {memberTypes.map((item) => (
            <Grid key={item.memberCount + item.memberTypeTitle} className="d-flex justify-content-between p-2" item>
              <MembersCountInfoCard
                icon={item.icon}
                memberCount={item.memberCount}
                memberTypeTitle={item.memberTypeTitle}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default MembersCard;
