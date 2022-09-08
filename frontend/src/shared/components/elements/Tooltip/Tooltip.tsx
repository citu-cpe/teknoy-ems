import {
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps,
} from '@chakra-ui/react';

interface TooltipProps {
  isDisabled?: boolean;
  openDelay?: number;
}

export const Tooltip = ({
  openDelay = 500,
  children,
  ...props
}: TooltipProps & ChakraTooltipProps) => {
  return (
    <ChakraTooltip openDelay={openDelay} label={children} hasArrow {...props}>
      {children}
    </ChakraTooltip>
  );
};
