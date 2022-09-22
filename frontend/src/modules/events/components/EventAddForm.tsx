import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  EventCreateDTO,
  EventCreateDTOStatusEnum,
  EventCreateDTOTypeEnum,
  EventCreateDTOViewAccessEnum,
  EventDTO,
} from 'generated-api';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import {
  FormLayout,
  Input,
  Select as FormSelect,
  Textarea,
} from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { useToast } from '../../../shared/hooks';
import { useGlobalStore } from '../../../shared/stores';
import { useEvents } from '../hooks/useEvents';
import { eventValidator } from '../schemas';
import { EquipmentSelect } from './EquipmentSelect';
import { OrganizerSelect } from './OrganizerSelect';
import { VenueSelect } from './VenueSelect';

export const formLabelProps = {
  minW: 44,
};

export const requiredControlProp = {
  isRequired: true,
};

interface EventAddFormProps {
  onComplete: (eventDTO: EventDTO) => void;
}

export const EventAddForm = ({ onComplete }: EventAddFormProps) => {
  const { addEvent } = useEvents();
  const { getUser } = useGlobalStore();

  const toast = useToast();

  const organizerKey = useRef(new Date().getTime() + Math.random());
  const equipmentKey = useRef(new Date().getTime() + Math.random());
  const venueKey = useRef(new Date().getTime() + Math.random());

  const onSubmit = (eventCreateDTO: EventCreateDTO) => {
    const formattedEvent = {
      ...eventCreateDTO,
      startTime: moment(eventCreateDTO.startTime).toISOString(),
      endTime: moment(eventCreateDTO.endTime).toISOString(),
    };

    addEvent.mutate(formattedEvent);
  };

  const initialValues = {
    title: '',
    description: '',
    type: EventCreateDTOTypeEnum.Seminar,
    viewAccess: EventCreateDTOViewAccessEnum.Public,
    status: EventCreateDTOStatusEnum.Pending,
    startTime: '',
    endTime: '',
    contactPerson: '',
    contactNumber: '',
    approvedBy: '',
    organizerId: '',
    equipmentIds: [],
    venueIds: [],
    additionalNotes: '',
    encodedById: getUser()?.id,
  };

  useEffect(() => {
    if (addEvent.isSuccess) {
      toast({ title: 'Added event successfully' });
      onComplete(addEvent.data.data);
    }
  }, [addEvent, onComplete, toast]);

  const handleReset = () => {
    // force reset async select keys by changing their prop keys
    organizerKey.current = new Date().getTime() + Math.random();
    equipmentKey.current = new Date().getTime() + Math.random();
    venueKey.current = new Date().getTime() + Math.random();
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
                  type='text'
                  id='approvedBy'
                  data-cy='approved-by-input'
                />
              )}
            </Field>

            <OrganizerSelect key={organizerKey.current} />
            <EquipmentSelect key={equipmentKey.current} />
            <VenueSelect key={venueKey.current} />

            <Field name='additionalNotes' type='text'>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Textarea
                  formLabelProps={formLabelProps}
                  fieldProps={fieldProps}
                  name='additionalNotes'
                  label='Additional Notes'
                  id='additionalNotes'
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
              isLoading={addEvent.isLoading}
              loadingText='Adding...'
            >
              Add Event
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
