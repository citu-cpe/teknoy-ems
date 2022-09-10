import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
} from '@chakra-ui/react';
import { Nav } from './Nav';

type MainNavProps = Omit<DrawerProps, 'children'>;

export const MainNav = ({ onClose, isOpen }: MainNavProps) => {
  return (
    <Box
      bg='gray.50'
      minH='100vh'
      _dark={{
        bg: 'gray.700',
      }}
    >
      {/* Desktop Nav */}
      <Nav
        visibility={{ base: 'hidden', md: 'visible' }}
        display={{ base: 'none', md: 'flex' }}
      />

      {/* Mobile Nav */}
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent maxW='navbarWidth'>
          <Nav />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
