import { Button, ButtonProps } from '@chakra-ui/react';
import NextLink from 'next/link';

interface LinkButtonProps {
  label: string;
  route: string;
}

export const LinkButton = ({
  label,
  route,
  ...props
}: LinkButtonProps & ButtonProps) => {
  return (
    <NextLink href={route} passHref>
      <Button as='a' {...props}>
        {label}
      </Button>
    </NextLink>
  );
};
