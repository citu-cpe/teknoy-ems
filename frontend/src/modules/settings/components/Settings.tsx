import { Badge, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { MasterSettingsDTO, RegisterUserDTORolesEnum } from 'generated-api';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { LinkButton } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { isRoleUnauthorized, valuesAreEqual } from '../../../shared/helpers';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { basicAuth } from '../../../shared/schemas';
import { useGlobalStore } from '../../../shared/stores';
import { MasterSettings } from './MasterSettings';

export const Settings = () => {
  const { getUser } = useGlobalStore();
  const user = getUser();
  const toast = useToast();
  const api = useContext(ApiContext);

  const [isAdmin, setIsAdmin] = useState(false);
  const [masterSettings, setMasterSettings] = useState<MasterSettingsDTO>();

  const getMasterSettings = useMutation(() => api.getMasterSettings(), {
    onSuccess: (res) => {
      setMasterSettings(res.data);
    },
  });

  const onUpdateComplete = (updatedSettings: MasterSettingsDTO) => {
    getMasterSettings.mutate();

    if (valuesAreEqual(masterSettings, updatedSettings)) {
      toast({ title: 'No changes made in Master Settings', status: 'info' });
    } else {
      toast({ title: 'Master settings updated' });
    }
  };

  useEffect(() => {
    if (user) {
      const roleUnauthorized = isRoleUnauthorized(user, [
        RegisterUserDTORolesEnum.Admin,
      ]);

      if (!roleUnauthorized) {
        getMasterSettings.mutate();
      }

      setIsAdmin(!roleUnauthorized);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout title='Settings'>
      <ContentHeader title='Settings' />
      <ContentSection>
        <Heading size='md' mt={3}>
          Profile
        </Heading>
        <Flex
          justifyContent={{ base: 'center', sm: 'space-between' }}
          textAlign={{ base: 'center', sm: 'justify' }}
          alignItems='center'
          flexWrap='wrap'
          gap={6}
        >
          <Flex direction='column' gap={3}>
            <Text fontWeight='bold' data-cy='user-name'>
              {user?.name}
            </Text>
            <Flex gap={3}>
              {user?.roles.map((role, index) => (
                <Badge key={index}>{role.toString()}</Badge>
              ))}
            </Flex>
          </Flex>
          <Flex direction='column' minW={56} maxW={{ base: 'full', md: 80 }}>
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
        </Flex>

        {isAdmin && !masterSettings && (
          <Center w='full' minH={20}>
            <Spinner colorScheme='brand' />
          </Center>
        )}

        {isAdmin && masterSettings && (
          <MasterSettings
            masterSettings={masterSettings}
            onComplete={onUpdateComplete}
          />
        )}
      </ContentSection>
    </MainLayout>
  );
};

Settings.auth = basicAuth;
