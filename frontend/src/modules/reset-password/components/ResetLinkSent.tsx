import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Code,
} from '@chakra-ui/react';

interface ResetLinkSentProps {
  email: string;
}

export const ResetLinkSent = ({ email }: ResetLinkSentProps) => {
  return (
    <Box borderWidth='1px' rounded='lg' p={3}>
      <Alert
        status='success'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        minH='50vh'
        rounded='lg'
      >
        <AlertIcon boxSize={10} mr={0} />
        <AlertTitle mt={4} mb={6} fontSize='xl'>
          Reset Password Link Sent
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          We have sent an email to <Code>{email}</Code> Please check your inbox
          or spam folder and <strong>click</strong> the link to continue.
        </AlertDescription>
      </Alert>
    </Box>
  );
};
