import { FormErrorMessage, Tooltip, TooltipProps } from '@chakra-ui/react';

interface ErrorTooptipProps {
  error: string | null | undefined;
  isInvalid: boolean;
}

export const ErrorTooltip = ({
  children,
  error,
  isInvalid,
  ...props
}: ErrorTooptipProps & TooltipProps & React.PropsWithChildren) => {
  return (
    <Tooltip
      hasArrow={isInvalid}
      isOpen={isInvalid}
      placement='bottom-end'
      color='errorColor'
      bg='errorBg'
      p={0}
      label={
        <FormErrorMessage
          bg='transparent'
          color='errorColor'
          m={0}
          px={2}
          py={1}
        >
          {error}
        </FormErrorMessage>
      }
      {...props}
    >
      {children}
    </Tooltip>
  );
};
