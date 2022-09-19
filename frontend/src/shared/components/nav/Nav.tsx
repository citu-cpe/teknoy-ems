import { Flex } from '@chakra-ui/react';
import { BiCalendarEvent, BiDevices, BiMap, BiUser } from 'react-icons/bi';
import {
  MdOutlineAccountTree,
  MdOutlineAnnouncement,
  MdOutlineDashboard,
} from 'react-icons/md';
import { Logo } from '../logo';
import { NavLink } from './NavLink';

export const Nav = ({ ...props }) => {
  return (
    <Flex
      direction='column'
      position='fixed'
      bg='foreground'
      m={0}
      p={0}
      pb={10}
      top={0}
      left={0}
      zIndex='navbar'
      h='100%'
      overflowY='auto'
      overflowX='hidden'
      w='navbarWidth'
      {...props}
    >
      <Logo />
      <NavLink label='Dashboard' route='/' icon={MdOutlineDashboard} />
      <NavLink
        label='Events'
        route='/events'
        isDisabled
        icon={BiCalendarEvent}
      />
      <NavLink label='Equipment' route='/equipment' icon={BiDevices} />
      <NavLink label='Venues' route='/venues' isDisabled icon={BiMap} />
      <NavLink
        label='Organizers'
        route='/organizers'
        icon={MdOutlineAccountTree}
      />
      <NavLink label='Accounts' route='/accounts' icon={BiUser} />
      <NavLink
        label='Announcements'
        route='/announcements'
        icon={MdOutlineAnnouncement}
      />
    </Flex>
  );
};
