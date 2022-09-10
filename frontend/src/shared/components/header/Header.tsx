import {
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BiBell, BiMenu } from 'react-icons/bi';
import { Navbar } from '../nav';
import { ThemeModeToggle } from './ThemeModeToggle';
import { HeaderProfile } from './HeaderProfile';

type HeaderProps = {
  routeBreadCrumb?: React.ReactNode;
};

export const Header = ({ routeBreadCrumb }: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          icon={<Icon boxSize='1.5rem' as={BiBell} />}
        ></MenuButton>
        <Portal>
          <MenuList fontSize='sm' minW={80} shadow='lg'>
            <MenuItem>
              <Flex direction='column' alignItems='start' maxW={80}>
                <Text fontWeight='bold'>Patrek</Text>
                <Text opacity={0.8} size='sm'>
                  Lag nasad ang Diverge
                </Text>
              </Flex>
            </MenuItem>
            <MenuItem>
              <Flex direction='column' alignItems='start' maxW={80}>
                <Text fontWeight='bold'>MVPrinch</Text>
                <Text opacity={0.8} size='sm'>
                  SURPASS YOUR LIMITS
                </Text>
              </Flex>
            </MenuItem>
            <MenuItem>
              <Flex direction='column' alignItems='start' maxW={80}>
                <Text fontWeight='bold'>Junix</Text>
                <Text opacity={0.8} size='sm'>
                  useEffect hihi
                </Text>
              </Flex>
            </MenuItem>
            <MenuItem>
              <Flex direction='column' alignItems='start' maxW={80}>
                <Text fontWeight='bold'>Keanue Leeves</Text>
                <Text opacity={0.8} size='sm'>
                  better than the real one
                </Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
      <HeaderProfile />
    </Flex>
  );
};
