import { Flex, FlexProps } from '@chakra-ui/react';
import { ThemeModeToggle } from './ThemeModeToggle';

export const ThemeModeToggleFloat = ({ ...props }: FlexProps) => {
  return (
    <Flex position='absolute' top={4} right={{ base: 4, md: 7 }} {...props}>
      <ThemeModeToggle />
    </Flex>
  );
};
