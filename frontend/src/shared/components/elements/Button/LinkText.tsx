import { Text, TextProps } from '@chakra-ui/react';
import NextLink from 'next/link';

interface LinkTextProps {
  label: string;
  route: string;
}

export const LinkText = ({
  label,
  route,
  ...props
}: LinkTextProps & TextProps) => {
  return (
    <NextLink href={route} passHref>
      <Text
        as='a'
        opacity={0.8}
        _hover={{
          opacity: 1,
          textDecoration: 'none',
          color: 'brand.200',
          cursor: 'pointer',
        }}
        textAlign='right'
        {...props}
      >
        {label}
      </Text>
    </NextLink>
  );
};
