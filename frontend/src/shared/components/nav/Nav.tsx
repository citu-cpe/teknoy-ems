import { Flex } from '@chakra-ui/react';
import { RegisterUserDTORolesEnum } from 'generated-api';
import { BiCalendarEvent, BiDevices, BiMap, BiUser } from 'react-icons/bi';
import {
  MdOutlineAccountTree,
  MdOutlineAnnouncement,
  MdOutlineDashboard,
} from 'react-icons/md';
import { useGlobalStore } from '../../stores';
import { TbReport } from 'react-icons/tb';
import { Logo } from '../logo';
import { NavLink } from './NavLink';

const basicModules: React.ReactNode[] = [
  <Logo key='logo' />,
  <NavLink
    key='dashboard'
    label='Dashboard'
    route='/'
    icon={MdOutlineDashboard}
  />,
  <NavLink
    key='events'
    label='Events'
    route='/events'
    isDisabled
    icon={BiCalendarEvent}
  />,
];

const adminModules: React.ReactNode[] = [
  <NavLink key='accounts' label='Accounts' route='/accounts' icon={BiUser} />,
  <NavLink key='reports' label='Reports' route='/reports' icon={TbReport} />,
];

const staffModules: React.ReactNode[] = [
  <NavLink
    key='equipment'
    label='Equipment'
    route='/equipment'
    icon={BiDevices}
  />,
  <NavLink
    key='venues'
    label='Venues'
    route='/venues'
    isDisabled
    icon={BiMap}
  />,
  <NavLink
    key='organizers'
    label='Organizers'
    route='/organizers'
    icon={MdOutlineAccountTree}
  />,
  <NavLink
    key='announcements'
    label='Announcements'
    route='/announcements'
    icon={MdOutlineAnnouncement}
  />,
];

export const Nav = ({ ...props }) => {
  const { getUser } = useGlobalStore();

  const roles = getUser()?.roles?.map((r) => r.toString());

  return (
    <Flex
      direction='column'
      position='fixed'
      bg='foreground'
      m={0}
      p={0}
      pb={10}
      top={0}
      left={0}
      zIndex='navbar'
      h='100%'
      overflowY='auto'
      overflowX='hidden'
      w='navbarWidth'
      {...props}
    >
      {basicModules.map((module) => module)}

      {roles?.includes(RegisterUserDTORolesEnum.Staff)
        ? staffModules.map((module) => module)
        : null}

      {roles?.includes(RegisterUserDTORolesEnum.Admin)
        ? adminModules.map((module) => module)
        : null}
    </Flex>
  );
};
