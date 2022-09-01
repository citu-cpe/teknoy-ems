import { Flex, Heading, Spacer } from '@chakra-ui/react';

interface ContentHeaderProps {
  title: React.ReactNode;
  actions?: React.ReactNode;
}

export const ContentHeader = ({ title, actions }: ContentHeaderProps) => {
  return (
    <Flex justifyContent='center' alignItems='center'>
      <Heading>{title}</Heading>
      <Spacer />
      {actions}
    </Flex>
  );
};
