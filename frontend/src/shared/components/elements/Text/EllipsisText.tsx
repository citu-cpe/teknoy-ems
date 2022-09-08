import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';
import { Tooltip } from '../Tooltip';

export const EllipsisText = ({
  children,
  ...props
}: React.PropsWithChildren & TextProps) => {
  return (
    <Tooltip openDelay={500} label={children} hasArrow>
      <Text
        w='full'
        textOverflow='ellipsis'
        overflow='hidden'
        whiteSpace='nowrap'
        color={props.color}
        bg={props.bg}
        fontWeight={props.fontWeight}
        fontStyle={props.fontStyle}
        fontSize={props.fontSize}
        opacity={props.opacity}
      >
        {children}
      </Text>
    </Tooltip>
  );
};
