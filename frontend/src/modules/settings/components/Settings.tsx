import { Badge, Flex, Text } from '@chakra-ui/react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { LinkButton } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { useGlobalStore } from '../../../shared/stores';

export const Settings = () => {
  const { getUser } = useGlobalStore();
  const user = getUser();

  return (
    <MainLayout title='Settings'>
      <ContentHeader title='Settings' />
      <ContentSection>
        <Text fontWeight='bold' data-cy='user-name'>
          {user?.name}
        </Text>
        <Flex gap={3}>
          {user?.roles.map((role, index) => (
            <Badge key={index}>{role.toString()}</Badge>
          ))}
        </Flex>
        <Flex direction='column' maxW={80}>
          <LinkButton
            label='Edit Profile'
            route='/settings/profile'
            data-cy='edit-profile-btn'
          />
          <LinkButton
            label='Change Password'
            route='/settings/profile/change-password'
            data-cy='change-password-btn'
          />
        </Flex>
      </ContentSection>
    </MainLayout>
  );
};
