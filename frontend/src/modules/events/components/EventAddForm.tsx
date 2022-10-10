import { Button, Divider, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  EventCreateDTO,
  EventCreateDTOStatusEnum,
  EventCreateDTOTypeEnum,
  EventCreateDTOViewAccessEnum,
  EventDTO,
} from 'generated-api';
import moment from 'moment';
import { useEffect } from 'react';
import {
  FormLayout,
  Input,
  Select as FormSelect,
  Textarea,
} from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { convertToEventCreateDTO } from '../../../shared/helpers/convert-to-event-create-dto';
import { parseDateTime } from '../../../shared/helpers/parse-date-time';
import { useGlobalStore } from '../../../shared/stores';
import { useSelectKeys } from '../hooks';
import { useEvents } from '../hooks/';
import { eventValidator } from '../schemas';
import { formLabelProps } from '../styles';
import { EquipmentSelect } from './EquipmentSelect';
import { OrganizerSelect } from './OrganizerSelect';
import { VenueSelect } from './VenueSelect';

export interface EventAddFormProps {
  /**
   * initialEventValue: event value from existing Event to update or generated from Event Templates
   */
  initialEventValue?: EventDTO | null | undefined;
  /**
   * onComplete: callback function passing a resulting Event value
   */
  onComplete: (eventDTO: EventDTO) => void;
}

export const EventAddForm = ({
  initialEventValue,
  onComplete,
}: EventAddFormProps) => {
  const { addEvent, editEvent } = useEvents();
  const { getUser } = useGlobalStore();
  const { equipmentKey, organizerKey, venueKey } = useSelectKeys();

  /**
   * Stores old event values before being updated.
   * Useful for quickly accessing fields prop rather than data fetching.
   */
  const eventCreateDTO = initialEventValue
    ? convertToEventCreateDTO(initialEventValue)
    : null;

  const initialValues = {
    title: initialEventValue?.title || '',
    description: initialEventValue?.description || '',
    type: eventCreateDTO?.type || EventCreateDTOTypeEnum.Seminar,
    viewAccess:
      eventCreateDTO?.viewAccess || EventCreateDTOViewAccessEnum.Public,
    status: eventCreateDTO?.status || EventCreateDTOStatusEnum.Pending,
    startTime:
      parseDateTime(initialEventValue?.startTime) ||
      parseDateTime(moment().add(4, 'days').toISOString()),
    endTime:
      parseDateTime(initialEventValue?.endTime) ||
      parseDateTime(moment().add(4, 'days').add(1, 'hours').toISOString()),
    contactPerson: initialEventValue?.contactPerson || '',
    contact: initialEventValue?.contact || '',
    approvedBy: initialEventValue?.approvedBy || '',
    organizerId: eventCreateDTO?.organizerId || '',
    equipmentIds: eventCreateDTO?.equipmentIds || [],
    venueIds: eventCreateDTO?.venueIds || [],
    additionalNotes: eventCreateDTO?.additionalNotes || '',
    encodedById: eventCreateDTO?.encodedById || getUser()?.id,
  };

  useEffect(() => {
    if (addEvent.isSuccess) {
      onComplete(addEvent.data.data);
    }

    if (editEvent.isSuccess) {
      onComplete(editEvent.data.data);
    }
  }, [addEvent, editEvent, onComplete]);

  /**
   * force reset async select keys by changing their prop keys references
   */
  const handleReset = () => {
    organizerKey.current = new Date().getTime() + Math.random();
    equipmentKey.current = new Date().getTime() + Math.random();
    venueKey.current = new Date().getTime() + Math.random();
  };

  const onSubmit = (newEvent: EventCreateDTO) => {
    const formattedEvent: EventCreateDTO = {
      ...newEvent,
      startTime: moment(newEvent.startTime).toISOString(),
      endTime: moment(newEvent.endTime).toISOString(),
    };

    if (initialEventValue) {
      const editedEventWithId = {
        ...formattedEvent,
        id: initialEventValue.id,
      };

      editEvent.mutate(editedEventWithId);
    } else {
      addEvent.mutate(formattedEvent);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={eventValidator}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <FormLayout>
            <Field name='type' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <FormSelect
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='type'
                  label='Type'
                  id='type'
                  isRequired
                  data-cy='type-select'
                >
                  <option value={EventCreateDTOTypeEnum.Seminar}>
                    Seminar
                  </option>
                  <option value={EventCreateDTOTypeEnum.Academic}>
                    Academic
                  </option>
                  <option value={EventCreateDTOTypeEnum.CampusWide}>
                    CampusWide
                  </option>
                  <option value={EventCreateDTOTypeEnum.Conference}>
                    Conference
                  </option>
                  <option value={EventCreateDTOTypeEnum.Corporate}>
                    Corporate
                  </option>
                  <option value={EventCreateDTOTypeEnum.Others}>Others</option>
                  <option value={EventCreateDTOTypeEnum.Sports}>Sports</option>
                  <option value={EventCreateDTOTypeEnum.Virtual}>
                    Virtual
                  </option>
                </FormSelect>
              )}
            </Field>

            <Field name='startTime' type='datetime-local' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='startTime'
                  label='Start Time'
                  type='datetime-local'
                  id='startTime'
                  isRequired
                  data-cy='start-time-input'
                />
              )}
            </Field>
            <Field name='endTime' type='datetime-local' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='endTime'
                  label='End Time'
                  type='datetime-local'
                  id='endTime'
                  isRequired
                  data-cy='end-time-input'
                />
              )}
            </Field>

            <VenueSelect
              key={venueKey.current}
              defaultValue={initialEventValue?.venues}
            />

            <EquipmentSelect
              key={equipmentKey.current}
              defaultValue={initialEventValue?.equipments}
            />

            <Divider />

            <Field name='title' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='title'
                  label='Title'
                  type='text'
                  id='title'
                  placeholder='Teknoy Seminar'
                  isRequired
                  data-cy='title-input'
                />
              )}
            </Field>
            <Field name='description' type='text'>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Textarea
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='description'
                  label='Description'
                  id='description'
                  placeholder='The College Faculty brings again another seminar series to help students foster...'
                  data-cy='description-input'
                  rows={8}
                />
              )}
            </Field>

            <Field name='viewAccess' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <FormSelect
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='viewAccess'
                  label='View Access'
                  id='viewAccess'
                  isRequired
                  data-cy='view-access-select'
                >
                  <option value={EventCreateDTOViewAccessEnum.Public}>
                    Public
                  </option>
                  <option value={EventCreateDTOViewAccessEnum.Private}>
                    Private
                  </option>
                </FormSelect>
              )}
            </Field>

            <OrganizerSelect
              key={organizerKey.current}
              defaultValue={initialEventValue?.organizer}
            />

            <Field name='contactPerson' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='contactPerson'
                  label='Contact Person'
                  type='text'
                  id='contactPerson'
                  placeholder='Juan Dela Cruz'
                  isRequired
                  data-cy='contact-person-input'
                />
              )}
            </Field>
            <Field name='contact' type='phone' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='contact'
                  label='Contact Info'
                  type='phone'
                  id='contact'
                  placeholder='e.g. MSTeams / Email / Messenger / Phone Number'
                  isRequired
                  data-cy='contact-input'
                />
              )}
            </Field>

            <Divider />

            <Field name='status' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <FormSelect
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='status'
                  label='Status'
                  id='status'
                  isRequired
                  data-cy='status-select'
                >
                  <option value={EventCreateDTOStatusEnum.Pending}>
                    Pending
                  </option>
                  <option value={EventCreateDTOStatusEnum.Reserved}>
                    Reserved
                  </option>
                  <option value={EventCreateDTOStatusEnum.Ongoing}>
                    Ongoing
                  </option>
                  <option value={EventCreateDTOStatusEnum.Done}>Done</option>
                  <option value={EventCreateDTOStatusEnum.Canceled}>
                    Canceled
                  </option>
                  <option value={EventCreateDTOStatusEnum.Postponed}>
                    Postponed
                  </option>
                </FormSelect>
              )}
            </Field>

            <Field name='approvedBy' type='text'>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='approvedBy'
                  label='Approved by'
                  placeholder="President's Office"
                  type='text'
                  id='approvedBy'
                  data-cy='approved-by-input'
                />
              )}
            </Field>

            <Field name='additionalNotes' type='text'>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Textarea
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='additionalNotes'
                  label='Additional Notes'
                  id='additionalNotes'
                  placeholder='Ask live streaming key from organizers'
                  data-cy='additional-notes-input'
                />
              )}
            </Field>
          </FormLayout>
          <Flex w='full' h='full'>
            <FormikResetButton onClick={handleReset} />
            <Spacer />
            <Button
              variant='solid'
              data-cy='add-submit-btn'
              formNoValidate
              type='submit'
              isLoading={addEvent.isLoading || editEvent.isLoading}
              loadingText={initialEventValue ? 'Updating...' : 'Adding'}
            >
              {initialEventValue ? 'Update' : 'Reserve'} Event
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
