import { GetStaticProps, NextPage } from 'next';
import { Settings } from '../../modules/settings/';

const SettingsPage: NextPage = () => <Settings />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: false,
    },
  };
};

export default SettingsPage;
