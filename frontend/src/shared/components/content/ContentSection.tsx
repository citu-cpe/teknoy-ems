import { Flex } from '@chakra-ui/react';

interface ContentSectionProps {
  children: React.ReactNode;
}

export const ContentSection = ({ children }: ContentSectionProps) => {
  return (
    <Flex
      direction='column'
      gap={3}
      bg='foreground'
      borderWidth='1px'
      rounded='lg'
      p={5}
    >
      {children}
    </Flex>
  );
};
