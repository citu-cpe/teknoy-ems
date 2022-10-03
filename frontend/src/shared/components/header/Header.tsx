import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
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
type HeaderProps = {
  routeBreadCrumb?: React.ReactNode;
};

export const Header = ({ routeBreadCrumb }: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificationFilter, setNotificationFilter] =
    useState<NotificationDateFilterEnum>(NotificationDateFilterEnum.ALL);
  const { notificationsDTO } = useGetFilteredNotification(notificationFilter);
  const queryClient = useQueryClient();
  const { markNotificationAsRead, markAllNotificationsAsRead } =
    useMarkNotificationasRead();
  const handleNotificationFilter = (dateFilter: NotificationDateFilterEnum) => {
    queryClient.invalidateQueries('notification');
    setNotificationFilter(dateFilter);
  };

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
            maxH={500}
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
                  onClick={() => {
                    handleNotificationFilter(NotificationDateFilterEnum.ALL);
                  }}
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
              {notificationsDTO?.notifications.length === 0 && (
                <Text
                  marginTop='1rem'
                  fontSize='lg'
                  fontWeight='bold'
                  textAlign='center'
                >
                  No notifications :c
                </Text>
              )}
              {notificationsDTO?.notifications.map(
                (n: NotificationDTO, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => markNotificationAsRead.mutate(n)}
                  >
                    <Flex direction='column' alignItems='start' maxW={80}>
                      {n.unread ? (
                        <Box
                          as={'span'}
                          color={'white'}
                          bottom={'2'}
                          position={'inherit'}
                          left={'5'}
                          bgColor={'red'}
                          borderRadius={'25'}
                          zIndex={1}
                          p={'2px'}
                          width={'0.5rem'}
                          height={'0.5rem'}
                        ></Box>
                      ) : null}

                      <Text opacity={0.8} fontSize='md' fontWeight='bold'>
                        {n.activityLog.entityName.toUpperCase()}
                      </Text>
                      <Text opacity={1} fontSize='sm'>
                        {n.activityLog.user.name}{' '}
                        {n.activityLog.action.toLowerCase()}{' '}
                        {n.activityLog.newValue && (
                          <>
                            {JSON.parse(n.activityLog.newValue)?.title ||
                              JSON.parse(n.activityLog.newValue)?.name}
                          </>
                        )}{' '}
                      </Text>
                      <Text color='gray.500'>
                        {Moment(n.activityLog.createdAt).fromNow()}
                      </Text>
                    </Flex>
                  </MenuItem>
                )
              )}
            </Tabs>
          </MenuList>
        </Portal>
      </Menu>
      <HeaderProfile />
    </Flex>
  );
};
