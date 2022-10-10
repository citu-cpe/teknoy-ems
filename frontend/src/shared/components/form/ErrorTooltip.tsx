import { Box, FormErrorMessage, Tooltip, TooltipProps } from '@chakra-ui/react';
import { PropsWithChildren, useRef } from 'react';
import { useOnScreen } from '../../hooks';

interface ErrorTooptipProps {
  error: string | null | undefined;
  isInvalid: boolean;
}

export const ErrorTooltip = ({
  children,
  error,
  isInvalid,
  ...props
}: ErrorTooptipProps & TooltipProps & PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <Tooltip
      hasArrow={isInvalid}
      isOpen={isVisible && isInvalid}
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
      <Box
        as='span'
        w='full'
        aria-label='Tooltip on screen reference'
        ref={ref}
      >
        {children}
      </Box>
    </Tooltip>
  );
};
