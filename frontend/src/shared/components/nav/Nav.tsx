import { Flex } from '@chakra-ui/react';
import { NavLink } from './NavLink';

export const Nav = () => {
  return (
    <Flex as='nav'>
      <NavLink label='Home' route='/' />
      <NavLink label='Accounts' route='/accounts' />
      <NavLink label='Events' route='/events' isDisabled />
      <NavLink label='Venues' route='/venues' isDisabled />
      <NavLink label='Organizers' route='/organizers' />
      <NavLink label='Equipment' route='/equipment' isDisabled />
      <NavLink label='Information' route='/information' isDisabled />
      <NavLink label='Themes' route='/themes' />
      <NavLink label='Settings' route='/settings' />
    </Flex>
  );
};
