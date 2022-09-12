import { Divider, Flex, Heading, Spacer } from '@chakra-ui/react';

interface ContentHeaderProps {
  title: React.ReactNode;
  actions?: React.ReactNode;
}

export const ContentHeader = ({ title, actions }: ContentHeaderProps) => {
  return (
    <>
      <Flex justifyContent='center' alignItems='center'>
        <Heading fontWeight='extrabold'>{title}</Heading>
        <Spacer />
        {actions}
      </Flex>
      <Divider borderColor='foreground' />
    </>
  );
};
