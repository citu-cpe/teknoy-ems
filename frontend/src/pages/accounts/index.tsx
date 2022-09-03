import { RegisterUserDTORolesEnum } from 'generated-api';
import { GetStaticProps, NextPage } from 'next';
import { Accounts } from '../../modules/accounts/components/Accounts';

const AccountsPage: NextPage = () => <Accounts />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: false,
      fallback: true,
      roles: [RegisterUserDTORolesEnum.Admin],
    },
  };
};

export default AccountsPage;
