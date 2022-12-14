import { Flex, FlexProps } from '@chakra-ui/react';

interface ContentSectionProps {
  children: React.ReactNode;
}

export const ContentSection = ({
  children,
  ...props
}: ContentSectionProps & FlexProps) => {
  return (
    <Flex
      direction='column'
      gap={3}
      bg='foreground'
      borderWidth='1px'
      rounded='xl'
      px={6}
      py={5}
      {...props}
    >
      {children}
    </Flex>
  );
};
