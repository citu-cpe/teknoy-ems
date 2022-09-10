import { Flex, Spacer, Text } from '@chakra-ui/react';

export const MainFooter = () => {
  return (
    <Flex direction='column' opacity={0.5}>
      <Flex fontSize='sm'>
        <Text>TeknoyEMS &copy; 2022</Text>
        <Spacer />
        <Text>The TEMS Team</Text>
      </Flex>
      <Flex fontSize='xs'>
        <Text>Teknoy Events Management System</Text>
        <Spacer />
        <Text>surpassing limits since 2022</Text>
      </Flex>
    </Flex>
  );
};
