import { UserDTO } from 'generated-api';
import { useEffect, useState } from 'react';
import { Dashboard } from '../modules/index/components/Dashboard';
import { Landing } from '../modules/index/components/Landing';
import { useGlobalStore } from '../shared/stores';

const Index = () => {
  const getUser = useGlobalStore((state) => state.getUser);
  const [user, setUser] = useState<UserDTO | undefined>(getUser());

  console.count('triggererd');

  // useEffect(() => {
  //   setUser(getUser());
  // }, [getUser]);

  return user ? <Dashboard /> : <Landing />;
};

export default Index;
