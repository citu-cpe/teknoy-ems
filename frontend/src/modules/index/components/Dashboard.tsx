import {
  Button,
  Center,
  Flex,
  FlexProps,
  Icon,
  Image,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
} from '@chakra-ui/react';
import {
  AnnouncementDTO,
  AnnouncementDTOViewAccessEnum,
  EventDTO,
  EventDTOStatusEnum,
} from 'generated-api';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BiCalendarCheck, BiCalendarX } from 'react-icons/bi';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout/MainLayout';
import { basicAuth } from '../../../shared/schemas';
import { useGlobalStore } from '../../../shared/stores';
import { useAnnouncements } from '../../announcements';
import { useEvents } from '../../events/';

import { BsPersonCheck } from 'react-icons/bs';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {
  imgSample1,
  imgSample2,
  imgSample3,
  imgSample4,
  imgSample5,
  imgSample6,
} from '../../../assets';
import { brandSmallScrollbar } from '../../../styles/components';

export const Dashboard = () => {
  const { fetchAllAnnouncements } = useAnnouncements();
  const { fetchAllEvents } = useEvents();
  const { getUser } = useGlobalStore();

  const [announcements, setAnnouncements] = useState<
    AnnouncementDTO[] | undefined
  >();

  const [events, setEvents] = useState<EventDTO[] | undefined>();

  useEffect(() => {
    fetchAllAnnouncements.mutate(undefined, {
      onSuccess: (res) => {
        setAnnouncements((prev) => [...res.data]);
      },
    });

    fetchAllEvents.mutate(undefined, {
      onSuccess: (res) => {
        setEvents((prev) => [...res.data]);
      },
    });
  }, []);

  const getUserEncodedEvents = () => {
    const user = getUser();
    if (events && user) {
      const reservedEvents = events?.filter(
        (ev) => ev.encodedBy.id === user.id
      );
      return reservedEvents.length;
    } else {
      return 0;
    }
  };

  const getCancelledOrPostponed = () => {
    if (events) {
      const reservedEvents = events?.filter(
        (ev) =>
          ev.status === EventDTOStatusEnum.Reserved ||
          ev.status === EventDTOStatusEnum.Done
      );
      return reservedEvents.length;
    } else {
      return 0;
    }
  };

  return (
    <MainLayout title='Dashboard' hideFooter>
      <ContentHeader
        title='Dashboard'
        actions={
          <Button variant='solid' data-cy='reserve-event-btn'>
            Reserve Event
          </Button>
        }
      />

      <Flex w='full' justifyContent='space-between' gap={6} position='relative'>
        <Flex
          w='full'
          gap={3}
          direction='column'
          justifyContent='start'
          alignItems='start'
          pr={60}
        >
          <Flex
            w='full'
            direction={{ base: 'column', xl: 'row' }}
            alignItems='center'
            justifyContent='space-between'
            gap={3}
          >
            <StatCard
              isLoading={fetchAllEvents.isLoading}
              header='All Events'
              content={events?.length.toString()}
              footer='Events'
              icon={
                <Icon as={BiCalendarCheck} boxSize='3rem' color='green.400' />
              }
            />
            <StatCard
              isLoading={fetchAllEvents.isLoading}
              header='Encoded by me'
              content={getUserEncodedEvents()}
              footer='Events'
              icon={<Icon as={BsPersonCheck} boxSize='3rem' color='blue.400' />}
            />
            <StatCard
              isLoading={fetchAllEvents.isLoading}
              header='Cancelled or Postponed'
              content={getCancelledOrPostponed()}
              footer='Events'
              icon={<Icon as={BiCalendarX} boxSize='3rem' color='orange.400' />}
            />
          </Flex>

          <Card
            alignItems='start'
            justifyContent='start'
            w='full'
            // h='34rem'
            // maxH='30vh'
            p={6}
          >
            <Swiper
              className='tems-swiper'
              modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
              autoplay={{
                delay: 3000,
              }}
              navigation
              pagination={{ clickable: true }}
              slidesPerView={1}
              centeredSlides
              loop
            >
              {[
                imgSample1,
                imgSample2,
                imgSample3,
                imgSample4,
                imgSample5,
                imgSample6,
              ].map((img, index) => (
                <SwiperSlide key={index}>
                  <Image
                    mx='auto'
                    h='full'
                    objectFit='cover'
                    objectPosition='center'
                    src={img.src}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Card>
        </Flex>
        <Flex
          position='absolute'
          top={0}
          right={0}
          maxH='full'
          overflowY='auto'
        >
          <Flex
            w='navbarWidth'
            maxW='navbarWidth'
            gap={3}
            direction='column'
            sx={brandSmallScrollbar}
          >
            {announcements &&
              announcements.map((an, index) => {
                if (an.viewAccess === AnnouncementDTOViewAccessEnum.Private) {
                  return;
                }

                return (
                  <ContentSection key={index} p={3} gap={2}>
                    <Flex direction='column'>
                      <Text fontWeight='bold' fontSize='sm'>
                        {an.title}
                      </Text>
                      {an.subtitle && <Text fontSize='sm'>{an.subtitle}</Text>}
                    </Flex>
                    <Text fontSize='xs'>{moment(an.updatedAt).fromNow()}</Text>
                    <Flex gap={2} flexWrap='wrap'>
                      {an.tags.map((t, index) => (
                        <Tag size='sm' key={index}>
                          {t}
                        </Tag>
                      ))}
                    </Flex>
                    <Text fontSize='xs'>{an.content}</Text>
                  </ContentSection>
                );
              })}
          </Flex>
        </Flex>
      </Flex>
    </MainLayout>
  );
};

Dashboard.auth = basicAuth;

interface CardProps extends FlexProps {}

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <Flex
      direction='row'
      gap={3}
      bg='foreground'
      borderWidth='1px'
      rounded='xl'
      w='full'
      h='full'
      minH={24}
      minW={56}
      px={4}
      py={2}
      {...props}
    >
      {children}
    </Flex>
  );
};

interface StatCardProps {
  isLoading: boolean;
  header: string | number | undefined | null;
  content: string | number | undefined | null;
  footer: string | number | undefined | null;
  icon: React.ReactNode;
}

export const StatCard = ({
  isLoading,
  header,
  content,
  footer,
  icon,
  ...props
}: StatCardProps & CardProps) => {
  useEffect(() => {}, [props]);

  return (
    <Card {...props}>
      {isLoading ? (
        <Center
          display='flex'
          w='full'
          h='full'
          justifyContent='start'
          alignItems='center'
        >
          <Spinner />
        </Center>
      ) : (
        <Stat>
          <StatLabel>{header}</StatLabel>
          <StatNumber>{content}</StatNumber>
          <StatHelpText mb={0}>{footer}</StatHelpText>
        </Stat>
      )}

      <Flex justifyContent='center' alignItems='center'>
        {icon}
      </Flex>
    </Card>
  );
};
