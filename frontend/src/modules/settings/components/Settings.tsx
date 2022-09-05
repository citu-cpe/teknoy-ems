import { Badge, Flex, Text } from '@chakra-ui/react';
import { ContentHeader } from '../../../shared/components/content';
import { LinkButton } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { useGlobalStore } from '../../../shared/stores';

export const Settings = () => {
  const { getUser } = useGlobalStore();
  const user = getUser();

  return (
    <MainLayout>
      <ContentHeader title='Settings' />
      <Text fontWeight='bold'>{user?.name}</Text>
      <Flex gap={3}>
        {user?.roles.map((role, index) => (
          <Badge key={index}>{role.toString()}</Badge>
        ))}
      </Flex>
      <Flex direction='column' maxW={80}>
        <LinkButton label='Edit Profile' route='/settings/profile' />
        <LinkButton
          label='Change Password'
          route='/settings/profile/change-password'
        />
      </Flex>
    </MainLayout>
  );
};
