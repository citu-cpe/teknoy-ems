import { GetStaticProps, NextPage } from 'next';
import { AccountRegister } from '../../../modules/accounts/components/AccountRegister';

const AccountRegisterPage: NextPage = () => <AccountRegister />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: false,
    },
  };
};

export default AccountRegisterPage;
