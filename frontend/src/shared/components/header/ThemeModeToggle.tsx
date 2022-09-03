import { Icon, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { BiMoon, BiSun } from 'react-icons/bi';

export const ThemeModeToggle = ({ ...props }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip
      label={`Enable ${colorMode === 'light' ? 'Dark' : 'Light'} mode`}
      placement='bottom'
    >
      <IconButton
        color='current'
        rounded='full'
        aria-label={`Enable ${colorMode === 'light' ? 'Dark' : 'Light'} mode`}
        onClick={toggleColorMode}
        icon={
          colorMode === 'light' ? (
            <Icon as={BiMoon} boxSize='1.5rem' />
          ) : (
            <Icon as={BiSun} boxSize='1.5rem' />
          )
        }
        {...props}
      />
    </Tooltip>
  );
};
