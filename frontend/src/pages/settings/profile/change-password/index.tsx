import { GetStaticProps, NextPage } from 'next';
import { ChangePassword } from '../../../../modules/settings';

const ChangePasswordPage: NextPage = () => <ChangePassword />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: false,
    },
  };
};

export default ChangePasswordPage;
