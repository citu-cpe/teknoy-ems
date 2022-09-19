import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';
import { Tooltip } from '../Tooltip';

/**
 * NOTE: `as` prop currently not supported
 */
export const EllipsisText = ({
  children,
  ...props
}: React.PropsWithChildren & TextProps) => {
  return (
    <Tooltip openDelay={500} label={children} placement='bottom-start' hasArrow>
      <Text
        w='full'
        textOverflow='ellipsis'
        overflow='hidden'
        whiteSpace='nowrap'
        {...props}
      >
        {children}
      </Text>
    </Tooltip>
  );
};
