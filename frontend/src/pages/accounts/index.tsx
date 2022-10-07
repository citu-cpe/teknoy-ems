import { Accounts } from '../../modules/accounts';

// const AccountsPage: NextPage = () => <Accounts />;

// export const getStaticProps: GetStaticProps = () => {
//   return {
//     props: {
//       dontShowUser: false,
//       fallback: true,
//       roles: [RegisterUserDTORolesEnum.Admin],
//     },
//   };
// };

// export const getServerSideProps = (context) => {
//   const user = { henlo: 'henlo' };
//   console.log({ context });

//   // if (!user) {
//   //   return {
//   //     redirect: {
//   //       destination: '/login',
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   return {
//     props: { user },
//   };
// };

export default Accounts;
