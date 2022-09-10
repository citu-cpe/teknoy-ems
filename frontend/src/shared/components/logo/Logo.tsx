import { Flex, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import {
  logoDark,
  logoLight,
  logoMobileDark,
  logoMobileLight,
} from '../../../assets';

export const Logo = () => {
  const logoDesktop = useColorModeValue(logoDark, logoLight);
  const logoMobile = useColorModeValue(logoMobileDark, logoMobileLight);

  return (
    <>
      {/* Desktop Icon */}
      <Flex
        p={3}
        objectFit='cover'
        visibility={{ base: 'hidden', md: 'visible' }}
        display={{ base: 'none', md: 'block' }}
        _hover={{ cursor: 'pointer' }}
      >
        <NextLink href='/'>
          <Image alt='TeknoyEMS logo' src={logoDesktop} layout='responsive' />
        </NextLink>
      </Flex>

      {/* Mobile Icon */}
      <Flex
        px={5}
        py={3}
        w={20}
        objectFit='cover'
        visibility={{ base: 'visible', md: 'hidden' }}
        display={{ base: 'noblockne', md: 'none' }}
        _hover={{ cursor: 'pointer' }}
      >
        <NextLink href='/'>
          <Image alt='TeknoyEMS logo' src={logoMobile} layout='responsive' />
        </NextLink>
      </Flex>
    </>
  );
};
