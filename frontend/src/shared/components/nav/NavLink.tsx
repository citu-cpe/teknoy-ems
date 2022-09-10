import { Box, ButtonProps, Flex, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NavTooltip } from './NavTooltip';
import { NavItem } from './types';

interface NavLinkProps {
  label: string;
  route: string;
}

export const NavLink = ({
  icon,
  label,
  route,
  hideTooltip,
  tooltipLabel,
  ...props
}: NavLinkProps & NavItem & ButtonProps) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(router.pathname === route);
  }, [router, route]);

  const activeProps = {
    bg: 'activeColor',
    color: 'foreground',
  };

  const getProps = () => {
    if (!isActive) {
      return {};
    }
    return activeProps;
  };

  const getBoxProps = () => {
    if (!isActive) {
      return {};
    }

    return {
      borderBottomWidth: '1px',
      borderBottomColor: 'foreground',
    };
  };

  return (
    <NavTooltip label={tooltipLabel} hideTooltip={hideTooltip}>
      <NextLink href={route} passHref>
        <Flex
          _hover={{
            bg: isActive ? 'activeColor' : 'focusBg',
            cursor: 'pointer',
          }}
          py={2}
          {...getProps()}
        >
          <Box w='full' px={10} {...getBoxProps()}>
            <Flex justifyContent='start' alignItems='center' pt={2} pb={3}>
              {icon && <Icon as={icon} boxSize={'1.2rem'} mr={2} />}
              <Text as='span' fontSize='sm'>
                {label}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </NextLink>
    </NavTooltip>
  );
};
