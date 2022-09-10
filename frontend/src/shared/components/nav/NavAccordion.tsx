import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Icon,
  Text,
} from '@chakra-ui/react';
import { NavTooltip } from './NavTooltip';
import { NavItem } from './types';

interface NavAccordionProps {
  label: React.ReactNode;
}

export const NavAccordion = ({
  icon,
  label,
  hideTooltip,
  tooltipLabel = label,
  children,
}: NavAccordionProps & NavItem & React.PropsWithChildren) => {
  return (
    <Accordion borderWidth={0} borderBottom={0} allowMultiple allowToggle>
      <AccordionItem p={0} borderWidth={0} m={0} borderBottom={0}>
        <NavTooltip label={tooltipLabel} hideTooltip={hideTooltip}>
          <AccordionButton
            as={Button}
            color='current'
            variant='ghost'
            justifyContent='start'
            alignItems='center'
            w='full'
            py={5}
            px={3}
            rounded='none'
            size='sm'
            _hover={{ bg: 'hoverBg' }}
            _expanded={{ bg: 'fgSecondary', shadow: 'md' }}
            borderWidth={0}
            borderLeftWidth={4}
            borderLeftColor='transparent'
          >
            <Icon as={icon} mr={2} />
            <Box flex='1' textAlign='left'>
              <Text fontSize='sm'>{label}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </NavTooltip>

        <AccordionPanel p={0} borderWidth={0} m={0} bg='fgTertiary'>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
