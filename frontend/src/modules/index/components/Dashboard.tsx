import { Button, Flex } from '@chakra-ui/react';
import {
  daxu,
  jaq,
  mvprinch,
  patrek,
  princh,
  raol,
} from '../../../assets/team';
import { ContentHeader } from '../../../shared/components/content';
import { TeamCard } from '../../../shared/components/elements/card';
import { MainLayout } from '../../../shared/components/layout/MainLayout';

export const Dashboard = () => {
  return (
    <MainLayout title='Dashboard'>
      <ContentHeader
        title='Dashboard'
        actions={
          <Button variant='solid' data-cy='reserve-event-btn'>
            Reserve Event
          </Button>
        }
      />
      <Flex flexWrap='wrap' w='full' gap={5} justify='center' align='center'>
        <TeamCard
          src={princh.src}
          srcHover={mvprinch.src}
          title='@yummy_yami'
          subtitle='MVPrinch'
          role='Scrum Master | Fullstack | QA'
        />
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
          role='Backend Development'
        />
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
    </MainLayout>
  );
};
