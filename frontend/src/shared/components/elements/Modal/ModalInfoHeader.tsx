import {
  Flex,
  FlexProps,
  Heading,
  HeadingProps,
  Icon,
  IconProps,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
  BiAlarmExclamation,
  BiCheck,
  BiError,
  BiInfoCircle,
} from 'react-icons/bi';

interface ModalInfoHeader {
  icon?: IconType;
  status?: 'info' | 'success' | 'warning' | 'error';
  flexProps?: FlexProps;
  iconProps?: IconProps;
  props?: HeadingProps;
  children: React.PropsWithChildren<React.ReactNode> | string;
}

export const ModalInfoHeader = ({
  icon,
  status = 'success',
  flexProps,
  iconProps,
  children,
  ...props
}: ModalInfoHeader) => {
  const getIcon = (): IconType => {
    if (status === 'success') {
      return BiCheck;
    }

    if (status === 'warning') {
      return BiAlarmExclamation;
    }

    if (status === 'error') {
      return BiError;
    }

    return BiInfoCircle;
  };

  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='center'
      {...flexProps}
    >
      <Icon
        as={getIcon()}
        boxSize='2.5rem'
        color={`${status}Color`}
        bg={`${status}Bg`}
        rounded='full'
        p={1}
        mb={4}
        {...iconProps}
      />
      <Heading size='md' mb={6} {...props}>
        {children}
      </Heading>
    </Flex>
  );
};
