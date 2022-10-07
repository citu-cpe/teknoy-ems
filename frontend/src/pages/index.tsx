import { UserDTO } from 'generated-api';
import { useState } from 'react';
import { Dashboard } from '../modules/index/components/Dashboard';
import { Landing } from '../modules/index/components/Landing';
import { useGlobalStore } from '../shared/stores';

const Index = () => {
  const getUser = useGlobalStore((state) => state.getUser);
  const [user] = useState<UserDTO | undefined>(getUser());

  return user ? <Dashboard /> : <Landing />;
};

export default Index;
