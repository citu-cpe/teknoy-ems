import {
  Badge,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { MainLayout } from '../../../shared/components/layout/MainLayout';
import { useGlobalStore } from '../../../shared/stores';
import { useLogout } from '../hooks/useLogout';

export const Home = () => {
  const logout = useLogout().mutate;
  const { getUser } = useGlobalStore();
  const user = getUser();

  return (
    <MainLayout
      w='100%'
      h='100vh'
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <Heading>Home</Heading>
      <VStack>
        <Text fontWeight='bold'>{user?.name}</Text>
        <Flex gap={3}>
          {user?.roles.map((role, index) => (
            <Badge key={index}>{role.toString()}</Badge>
          ))}
        </Flex>
      </VStack>
      <Spacer />
      <Button variant='solid' onClick={() => logout()}>
        Log Out
      </Button>
    </MainLayout>
  );
};
