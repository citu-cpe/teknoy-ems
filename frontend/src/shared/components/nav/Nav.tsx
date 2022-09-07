import { Flex } from '@chakra-ui/react';
import { NavLink } from './NavLink';

export const Nav = () => {
  return (
    <Flex as='nav'>
      <NavLink label='Dashboard' route='/' />
      <NavLink label='Events' route='/events' isDisabled />
      <NavLink label='Equipment' route='/equipment' />
      <NavLink label='Venues' route='/venues' isDisabled />
      <NavLink label='Organizers' route='/organizers' />
      <NavLink label='Information' route='/information' isDisabled />
      <NavLink label='Accounts' route='/accounts' />
      <NavLink label='Themes' route='/themes' />
      <NavLink label='Settings' route='/settings' />
    </Flex>
  );
};
