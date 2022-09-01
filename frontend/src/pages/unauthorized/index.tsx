import { GetStaticProps, NextPage } from 'next';
import { Unauthorized } from '../../modules/unauthorized';

const UnauthorizedPage: NextPage = () => <Unauthorized />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: false,
      fallback: true,
    },
  };
};

export default UnauthorizedPage;
