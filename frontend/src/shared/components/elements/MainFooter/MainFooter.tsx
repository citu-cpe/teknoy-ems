import { Flex, FlexProps, Spacer } from '@chakra-ui/react';
import { LinkText } from '../Button';

export const MainFooter = ({ ...props }: FlexProps) => {
  return (
    <Flex direction='column' opacity={0.5} {...props}>
      <Flex fontSize='sm'>
        <LinkText label='The TEMS Team' route='/' />
        <Spacer />
        <LinkText label='TeknoyEMS &copy; 2022' route='/about' />
      </Flex>
      <Flex fontSize='xs'>
        <LinkText label='Teknoy Events Management System' route='/' />
        <Spacer />
        <LinkText label='surpassing limits since 2022' route='/about' />
      </Flex>
    </Flex>
  );
};
