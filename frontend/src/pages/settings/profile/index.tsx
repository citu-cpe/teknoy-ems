import { GetStaticProps, NextPage } from 'next';
import { Profile } from '../../../modules/settings';

const ProfilePage: NextPage = () => <Profile />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: false,
    },
  };
};

export default ProfilePage;
