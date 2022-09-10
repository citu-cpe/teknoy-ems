import {
  Avatar,
  Badge,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogout } from '../../../modules/index';
import { useGlobalStore } from '../../stores';

export const HeaderProfile = () => {
  const logout = useLogout().mutate;
  const { getUser } = useGlobalStore();
  const user = getUser();

  return (
    <Menu>
      <MenuButton ml={4} data-cy='profile-btn'>
        <Avatar name='Admin' boxSize='2rem' rounded='full' src='#' />
      </MenuButton>
      <Portal>
        <MenuList fontSize='sm' shadow='lg'>
          <MenuGroup fontSize='sm'>
            <NextLink href='/settings/profile'>
              <MenuItem>
                <Flex direction='column' gap={1}>
                  <Text fontSize='md' fontWeight='medium'>
                    {user?.name}
                  </Text>
                  <Flex gap={1}>
                    {user?.roles.map((role, index) => (
                      <Badge key={index} size='sm'>
                        {role.toString()}
                      </Badge>
                    ))}
                  </Flex>
                </Flex>
              </MenuItem>
            </NextLink>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup fontSize='sm'>
            <NextLink href='/themes'>
              <MenuItem>Themes</MenuItem>
            </NextLink>
            <NextLink href='/settings'>
              <MenuItem>Settings</MenuItem>
            </NextLink>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup fontSize='sm'>
            <MenuItem data-cy='logout-btn' onClick={() => logout()}>
              Log out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
};
