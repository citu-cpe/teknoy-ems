import { Flex, FlexProps } from '@chakra-ui/react';

interface ContentSectionProps {
  children: React.ReactNode;
}

export const FormLayout = ({
  children,
  ...props
}: ContentSectionProps & FlexProps) => {
  return (
    <Flex direction='column' mb={10} gap={6} {...props}>
      {children}
    </Flex>
  );
};
