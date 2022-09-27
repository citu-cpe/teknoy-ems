import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik, useFormikContext } from 'formik';
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
   * existingEventValue: event value when form is being used during Event Update forms
   */
  existingEventValue?: EventDTO | null | undefined;
  /**
   * onComplete: callback function passing a resulting Event value
   */
  onComplete: (eventDTO: EventDTO) => void;
}

export const EventAddForm = ({
  existingEventValue,
  onComplete,
}: EventAddFormProps) => {
  const { addEvent, editEvent, verifyEvent } = useEvents();
  const { getUser } = useGlobalStore();
  const { equipmentKey, organizerKey, venueKey } = useSelectKeys();

  /**
   * stores old event values before being updated
   * useful for quickly accessing prop fields rather than server fetching
   */
  const eventCreateDTO = existingEventValue
    ? convertToEventCreateDTO(existingEventValue)
    : null;

  const initialValues = {
    title: existingEventValue?.title || '',
    description: existingEventValue?.description || '',
    type: eventCreateDTO?.type || EventCreateDTOTypeEnum.Seminar,
    viewAccess:
      eventCreateDTO?.viewAccess || EventCreateDTOViewAccessEnum.Public,
    status: eventCreateDTO?.status || EventCreateDTOStatusEnum.Pending,
    startTime:
      parseDateTime(existingEventValue?.startTime) ||
      parseDateTime(moment().format()),
    endTime:
      parseDateTime(existingEventValue?.endTime) ||
      parseDateTime(moment().add(1, 'hours').toISOString()),
    contactPerson: existingEventValue?.contactPerson || '',
    contactNumber: existingEventValue?.contactNumber || '',
    approvedBy: existingEventValue?.approvedBy || '',
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
   * force reset async select keys by changing their prop keys
   */
  const handleReset = () => {
    organizerKey.current = new Date().getTime() + Math.random();
    equipmentKey.current = new Date().getTime() + Math.random();
    venueKey.current = new Date().getTime() + Math.random();
  };

  // TODO commented for future implementations
  // const handleVerify = (eventValue: EventCreateDTO) => {
  //   if (existingEventValue) {
  //     // event form is used for `updating` an event
  //     const formattedEvent = {
  //       ...eventValue,
  //       id: existingEventValue.id,
  //       startTime: moment(eventValue.startTime).toISOString(),
  //       endTime: moment(eventValue.endTime).toISOString(),
  //     };

  //     verifyEvent.mutate(formattedEvent);
  //   } else {
  //     // event form is used for `adding` an event
  //     const formattedEvent = {
  //       ...eventValue,
  //       startTime: moment(eventValue.startTime).toISOString(),
  //       endTime: moment(eventValue.endTime).toISOString(),
  //     };

  //     verifyEvent.mutate(formattedEvent);
  //   }
  // };

  const onSubmit = (newEvent: EventCreateDTO) => {
    if (existingEventValue) {
      // event form is used for `updating` an event
      const formattedEvent = {
        ...newEvent,
        id: existingEventValue.id,
        startTime: moment(newEvent.startTime).toISOString(),
        endTime: moment(newEvent.endTime).toISOString(),
      };

      editEvent.mutate(formattedEvent);
    } else {
      // event form is used for `adding` an event
      const formattedEvent = {
        ...newEvent,
        startTime: moment(newEvent.startTime).toISOString(),
        endTime: moment(newEvent.endTime).toISOString(),
      };

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
            <Field name='contactNumber' type='phone' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='contactNumber'
                  label='Contact Number'
                  type='phone'
                  id='contactNumber'
                  placeholder='9123456789'
                  isRequired
                  data-cy='contact-number-input'
                />
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

            <OrganizerSelect
              key={organizerKey.current}
              defaultValue={existingEventValue?.organizer}
            />

            <EquipmentSelect
              key={equipmentKey.current}
              defaultValue={existingEventValue?.equipments}
            />

            <VenueSelect
              key={venueKey.current}
              defaultValue={existingEventValue?.venues}
            />

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
            {/* <VerifyEventButton onVerify={handleVerify} /> */}
            <Button
              variant='solid'
              data-cy='add-submit-btn'
              formNoValidate
              type='submit'
              isLoading={addEvent.isLoading}
              loadingText='Adding...'
            >
              Reserve Event
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

interface VerifyEventButtonProps {
  onVerify: (values: unknown) => void;
}

export const VerifyEventButton = ({ onVerify }: VerifyEventButtonProps) => {
  const { values } = useFormikContext();

  const handleClick = () => {
    onVerify(values);
  };

  return (
    <Button
      variant='outline'
      data-cy='add-submit-btn'
      formNoValidate
      mr={2}
      onClick={handleClick}
    >
      Verify
    </Button>
  );
};
