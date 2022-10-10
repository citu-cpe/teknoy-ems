import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
} from '@chakra-ui/react';

export const ResetPasswordSuccess = () => {
  return (
    <Box borderWidth='1px' rounded='lg' p={3}>
      <Alert
        status='success'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='50vh'
        rounded='lg'
      >
        <AlertIcon boxSize={10} mr={0} />
        <AlertTitle mt={4} mb={2} fontSize='xl'>
          Password Reset Successfully
        </AlertTitle>
        <AlertDescription
          maxWidth='sm'
          display='flex'
          alignItems='center'
          gap={2}
        >
          Redirecting to login page... <Spinner />
        </AlertDescription>
      </Alert>
    </Box>
  );
};
