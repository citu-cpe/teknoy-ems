import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spacer,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BiBell, BiMenu } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { Navbar } from '../nav';
import { ThemeModeToggle } from './ThemeModeToggle';
import { HeaderProfile } from './HeaderProfile';
import Moment from 'moment';
import { useMarkNotificationasRead } from '../../hooks/useMarkNotifications';
import { NotificationDTO } from 'generated-api';
import { useGetActivityLogs } from '../../hooks/useGetActivityLogs';
import { useGetFilteredNotification } from '../../hooks/useGetFilteredNotifications';
import { NotificationDateFilterEnum } from '../../enums/notificationDateFilter';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { brandSmallScrollbar } from '../../../styles/components';
type HeaderProps = {
  routeBreadCrumb?: React.ReactNode;
};

export const Header = ({ routeBreadCrumb }: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificationFilter, setNotificationFilter] =
    useState<NotificationDateFilterEnum>(NotificationDateFilterEnum.ALL);
  const { notificationsDTO, isLoading } =
    useGetFilteredNotification(notificationFilter);
  const queryClient = useQueryClient();
  const { markNotificationAsRead, markAllNotificationsAsRead } =
    useMarkNotificationasRead();
  const handleNotificationFilter = (dateFilter: NotificationDateFilterEnum) => {
    queryClient.invalidateQueries('notification');
    setNotificationFilter(dateFilter);
  };
  const vowelRegex = '^[aeio].*';

  useGetActivityLogs();

  return (
    <Flex
      direction='row'
      w='100%'
      m={0}
      h='headerHeight'
      alignItems='center'
      justifyContent={{ base: 'flex-start', md: 'space-between' }}
      position={{ base: 'fixed', md: 'unset' }}
      top={0}
      left={0}
      px={{ base: 5, md: 0 }}
      zIndex={{ base: 4, md: 0 }}
      bg={{ base: 'foreground', md: 'transparent' }}
    >
      <IconButton
        aria-label='Open Navbar'
        color='current'
        rounded='full'
        icon={<Icon boxSize='2rem' as={BiMenu} />}
        visibility={{ base: 'visible', md: 'hidden' }}
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
      />
      {routeBreadCrumb}
      <Navbar onClose={onClose} isOpen={isOpen} />
      <Spacer />
      <ThemeModeToggle />
      <Menu strategy='absolute'>
        <MenuButton
          as={IconButton}
          aria-label='Open notifications'
          color='current'
          rounded='full'
          icon={
            <>
              <Icon boxSize='1.5rem' as={BiBell} />
              {notificationsDTO && notificationsDTO.numberOfUnread > 0 && (
                <Box
                  as={'span'}
                  color={'white'}
                  position={'absolute'}
                  top={'2px'}
                  right={'3px'}
                  fontSize={'0.8rem'}
                  bgColor={'red'}
                  borderRadius={'25'}
                  zIndex={9999}
                  p={'2px'}
                >
                  {notificationsDTO?.numberOfUnread}
                </Box>
              )}
            </>
          }
        ></MenuButton>
        <Portal>
          <MenuList
            fontSize='sm'
            minW={80}
            shadow='lg'
            overflowY='scroll'
            p={15}
            maxH={'80vh'}
            sx={brandSmallScrollbar}
          >
            <Tabs size='sm' variant='soft-rounded'>
              <Flex direction={'row'}>
                <Heading size='md' marginBottom={2}>
                  Notifications
                </Heading>

                <Spacer />
                <Popover placement='bottom-end'>
                  <PopoverTrigger>
                    <IconButton
                      marginTop={'-0.5rem'}
                      aria-label='options'
                      icon={<BsThreeDots />}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>Notification Settings</PopoverHeader>
                    <PopoverBody>
                      <Flex direction={'column'}>
                        <Button
                          w={'full'}
                          onClick={() => markAllNotificationsAsRead.mutate()}
                          size={'xs'}
                        >
                          Mark all as read
                        </Button>
                      </Flex>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
              <TabList>
                <Tab
                  onClick={() =>
                    handleNotificationFilter(NotificationDateFilterEnum.ALL)
                  }
                >
                  All
                </Tab>
                <Tab
                  onClick={() =>
                    handleNotificationFilter(NotificationDateFilterEnum.TODAY)
                  }
                >
                  Today
                </Tab>
                <Tab
                  onClick={() =>
                    handleNotificationFilter(
                      NotificationDateFilterEnum.LAST_WEEK
                    )
                  }
                >
                  Last week
                </Tab>
                <Tab
                  onClick={() =>
                    handleNotificationFilter(
                      NotificationDateFilterEnum.LAST_MONTH
                    )
                  }
                >
                  Last month
                </Tab>
              </TabList>
              <Divider marginTop={2} />
              {isLoading ? (
                <Center minH={80} minW={80}>
                  <Spinner colorScheme='brand' />
                </Center>
              ) : (
                <>
                  {notificationsDTO?.notifications.length === 0 && (
                    <Text
                      marginTop='1rem'
                      fontSize='lg'
                      fontWeight='bold'
                      textAlign='center'
                    >
                      You have no new notifications
                    </Text>
                  )}

                  {notificationsDTO?.notifications.map(
                    (n: NotificationDTO, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => markNotificationAsRead.mutate(n)}
                      >
                        <Flex
                          direction='row'
                          alignItems='start'
                          maxW={80}
                          position={'relative'}
                        >
                          {n.unread ? (
                            <Box
                              as={'span'}
                              top={0}
                              bottom={0}
                              margin={'auto'}
                              position={'absolute'}
                              left={300}
                              bgColor={'blue.400'}
                              borderRadius={'25'}
                              zIndex={1}
                              p={'5px'}
                              verticalAlign={'middle'}
                              width={'0.5rem'}
                              height={'0.5rem'}
                            ></Box>
                          ) : null}
                          <Flex>
                            <HStack>
                              <Avatar name={n.activityLog.user.name} />
                              <Spacer />
                              <Flex direction={'column'}>
                                <Text fontSize='sm' fontWeight={'bold'}>
                                  {n.activityLog.user.name}{' '}
                                </Text>
                                <Box maxW='210px' w={'100%'}>
                                  <Text
                                    opacity={1}
                                    fontSize='sm'
                                    textAlign={'left'}
                                  >
                                    has {n.activityLog.action.toLowerCase()}{' '}
                                    {n.activityLog.action === 'ADDED' ||
                                    n.activityLog.action === 'REGISTERED'
                                      ? 'a new '
                                      : n.activityLog.entityName.match(
                                          vowelRegex
                                        )
                                      ? 'an '
                                      : 'a '}
                                    {n.activityLog.entityName}{' '}
                                    <i>
                                      <strong>
                                        {n.activityLog.newValue && (
                                          <>
                                            {JSON.parse(n.activityLog.newValue)
                                              ?.title ||
                                              JSON.parse(n.activityLog.newValue)
                                                ?.name}
                                          </>
                                        )}{' '}
                                      </strong>
                                    </i>
                                  </Text>
                                </Box>

                                <Text
                                  color={n.unread ? 'blue.400' : 'gray.500'}
                                >
                                  {Moment(n.activityLog.createdAt).fromNow()}
                                </Text>
                              </Flex>
                            </HStack>
                          </Flex>
                        </Flex>
                      </MenuItem>
                    )
                  )}
                </>
              )}
            </Tabs>
          </MenuList>
        </Portal>
      </Menu>
      <HeaderProfile />
    </Flex>
  );
};
