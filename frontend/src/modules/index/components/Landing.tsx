import {
  Center,
  Flex,
  Heading,
  Image,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { logoMobileBlack, logoMobileLight } from '../../../assets';
import { LinkButton } from '../../../shared/components/elements';
import {
  ThemeModeToggleFloat
} from '../../../shared/components/header';
import { LinkParticles } from './LinkParticles';

export const Landing = () => {
  const { colorMode } = useColorMode();
  const logoDesktop = useColorModeValue(logoMobileBlack, logoMobileLight);

  return (
    <>
      <LinkParticles theme={colorMode} />

      <Center w='100%' h='100vh' flexDir='column'>
        <Flex direction='column' alignItems='center' gap={6}>
          <Image src={logoDesktop.src} alt='Teknoy EMS Logo' boxSize={72} />
          <Flex
            direction='column'
            gap={0}
            justifyContent='center'
            alignItems='center'
          >
            <Heading
              fontWeight='black'
              letterSpacing='tighter'
              as='h1'
              size='3xl'
            >
              TEKNOY
            </Heading>
            <span>EVENTS MANAGEMENT SYSTEM</span>
          </Flex>

          <Flex
            direction='column'
            gap={3}
            justifyContent='center'
            alignItems='center'
          >
            <LinkButton
              variant='solid'
              label='Log In'
              route='/login'
              minW={56}
            />
            <LinkButton label='About' route='/about' minW={56} />
          </Flex>

          <ThemeModeToggleFloat />
        </Flex>
      </Center>
    </>
  );
};
