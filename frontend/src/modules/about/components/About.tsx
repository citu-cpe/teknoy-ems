import { Flex, Heading } from '@chakra-ui/react';
import {
  daxu,
  jaq,
  mvprinch,
  patrek,
  princh,
  raol
} from '../../../assets/team';
import { BackButton } from '../../../shared/components/elements';
import { TeamCard } from '../../../shared/components/elements/card';
import { MainFooter } from '../../../shared/components/elements/MainFooter/MainFooter';
import { ThemeModeToggleFloat } from '../../../shared/components/header';

export const About = () => {
  return (
    <Flex
      direction='column'
      alignItems='stretch'
      justifyContent='center'
      gap={3}
      w='full'
      mx='auto'
      textAlign='center'
      p={3}
      pt={14}
    >
      <Heading my={6}>About</Heading>
      <Flex flexWrap='wrap' w='full' gap={5} justify='center' align='center'>
        <Flex w='full' alignItems='center' justifyContent='center'>
          <TeamCard
            src={princh.src}
            srcHover={mvprinch.src}
            title='@yummy_yami'
            subtitle='MVPrinch'
            role='Scrum Master | Fullstack | QA'
          />
        </Flex>

        <Flex
          gap={3}
          flexWrap='wrap'
          alignItems='center'
          justifyContent='center'
        >
          <TeamCard
            src={raol.src}
            title='@magna_kumlodi'
            subtitle='raol'
            role='Product Owner | Frontend Development'
          />
          <TeamCard
            src={patrek.src}
            title='@marie_gration'
            subtitle='patrek'
            role='Fullstack Development'
          />
        </Flex>
        <Flex
          gap={3}
          flexWrap='wrap'
          alignItems='center'
          justifyContent='center'
        >
          <TeamCard
            src={jaq.src}
            title='@asta_ng_dimalasa'
            subtitle='jaq'
            role='QA | Test Manager'
          />
          <TeamCard
            src={daxu.src}
            title='@grey_border'
            subtitle='daxu'
            role='UI/UX Designer'
          />
        </Flex>
      </Flex>

      <MainFooter mt={10} />
      <BackButton />
      <ThemeModeToggleFloat />
    </Flex>
  );
};
