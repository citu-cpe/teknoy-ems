import { Button, ButtonProps } from '@chakra-ui/react';
import NextLink from 'next/link';

interface NavLinkProps {
  label: string;
  route: string;
}

export const NavLink = ({
  label,
  route,
  ...props
}: NavLinkProps & ButtonProps) => {
  return (
    <NextLink href={route} passHref>
      <Button as='a' {...props} color='current'>
        {label}
      </Button>
    </NextLink>
  );
};
