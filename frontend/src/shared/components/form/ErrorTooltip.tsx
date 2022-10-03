import { FormErrorMessage, Tooltip, TooltipProps } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

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
  const [show, setShow] = useState<boolean | undefined | null>(false);
  const [alreadyShown, setInitial] = useState(false);

  useEffect(() => {
    if (isInvalid && !alreadyShown) {
      console.log('showing...');
      setShow(true);
      trigger();
    }
  }, [isInvalid, alreadyShown]);

  const trigger = () => {
    setTimeout(() => {
      console.log('done');
      setShow(undefined);
      setInitial(true);
    }, 2000);
  };

  const handleHover = () => {
    setShow(true);
  };

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
      portalProps={{
        appendToParentPortal: true,
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};
