import { Tag, TagProps } from '@chakra-ui/react';
import { EventDTOStatusEnum } from 'generated-api';

export interface EventStatusProps {
  status: EventDTOStatusEnum;
}

export const getEventStatusScheme = (status: EventDTOStatusEnum) => {
  switch (status) {
    case EventDTOStatusEnum.Pending:
      return 'gray';
    case EventDTOStatusEnum.Reserved:
      return 'orange';
    case EventDTOStatusEnum.Ongoing:
      return 'green';
    case EventDTOStatusEnum.Done:
      return 'blue';
    case EventDTOStatusEnum.Canceled:
      return 'red';
    case EventDTOStatusEnum.Postponed:
      return 'pink';
    default:
      return 'gray';
  }
};

export const getEventStatusColor = (status: EventDTOStatusEnum) => {
  switch (status) {
    case EventDTOStatusEnum.Pending:
      return '#718096';
    case EventDTOStatusEnum.Reserved:
      return '#F6AD55';
    case EventDTOStatusEnum.Ongoing:
      return '#68D391';
    case EventDTOStatusEnum.Done:
      return '#63B3ED';
    case EventDTOStatusEnum.Canceled:
      return '#FC8181';
    case EventDTOStatusEnum.Postponed:
      return '#FC8181';
    default:
      return '#718096';
  }
};

export const EventStatus = ({
  status,
  ...props
}: EventStatusProps & TagProps) => {
  return (
    <Tag colorScheme={getEventStatusScheme(status)} {...props}>
      {status}
    </Tag>
  );
};
