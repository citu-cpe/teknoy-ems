import { Flex, Spacer } from '@chakra-ui/react';
import { ThemeModeToggle } from '../header';
import { Nav } from './Nav';

export const Navbar = () => {
  return (
    <Flex>
      <Nav />
      <Spacer />
      <ThemeModeToggle />
    </Flex>
  );
};
