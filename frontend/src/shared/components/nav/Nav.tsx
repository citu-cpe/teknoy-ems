import { Flex } from '@chakra-ui/react';
import {
  BiCalendarEvent,
  BiDevices,
  BiHome,
  BiInfoCircle,
  BiMap,
  BiUser,
} from 'react-icons/bi';
import { MdOutlineAccountTree } from 'react-icons/md';
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
      <NavLink label='Dashboard' route='/' icon={BiHome} />
      <NavLink label='Events' route='#' isDisabled icon={BiCalendarEvent} />
      <NavLink label='Equipment' route='/equipment' icon={BiDevices} />
      <NavLink label='Venues' route='#' isDisabled icon={BiMap} />
      <NavLink
        label='Organizers'
        route='/organizers'
        icon={MdOutlineAccountTree}
      />
      <NavLink label='Accounts' route='/accounts' icon={BiUser} />
      <NavLink label='Information' route='#' icon={BiInfoCircle} />
    </Flex>
  );
};
