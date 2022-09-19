import { Button, Flex, FormControl, FormLabel, Spacer } from '@chakra-ui/react';
import Select from 'react-select';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  EventDTO,
  EventCreateDTO,
  EventCreateDTOStatusEnum,
  EventCreateDTOTypeEnum,
  EventCreateDTOViewAccessEnum,
} from 'generated-api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import {
  Checkbox,
  FormLayout,
  Input,
  Select as FormSelect,
  Textarea,
} from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { useToast } from '../../../shared/hooks';
import { useGlobalStore } from '../../../shared/stores';
import { useEvents } from '../hooks/useEvents';

interface EventAddFormProps {
  onComplete: (eventDTO: EventDTO) => void;
}

export const EventAddForm = ({ onComplete }: EventAddFormProps) => {
  const { addEvent } = useEvents();
  const toast = useToast();
  const { getUser } = useGlobalStore();

  const onSubmit = (eventCreateDTO: EventCreateDTO) => {
    addEvent.mutate(eventCreateDTO);
  };

  const initialValues = {
    // id: '',
    title: '',
    description: '',
    status: EventCreateDTOStatusEnum.Pending,
    startTime: '2022-09-19 2:00:00 PM',
    endTime: '2022-09-19 5:00:00 PM',
    contactPerson: '',
    contactNumber: '',
    approvedBy: '',
    viewAccess: EventCreateDTOViewAccessEnum.Public,
    type: EventCreateDTOTypeEnum.Seminar,
    additionalNotes: '',
    organizerId: '',
    encodedById: getUser()?.name,
    equipmentIds: [],
    venueIds: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string().min(1).max(40).required('Required'),
  });

  useEffect(() => {
    if (addEvent.isSuccess) {
      toast({ title: 'Added organizer successfully' });
      onComplete(addEvent.data.data);
    }
  }, [addEvent, onComplete, toast]);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <FormLayout>
            <Field name='title' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={{
                    minW: 44,
                  }}
                  fieldProps={fieldProps}
                  name='title'
                  label='Title'
                  type='text'
                  id='title'
                  placeholder='Event title'
                  isRequired
                  data-cy='name-input'
                />
              )}
            </Field>
            <Field name='description' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Textarea
                  formLabelProps={{
                    minW: 44,
                  }}
                  fieldProps={fieldProps}
                  name='description'
                  label='Description'
                  id='description'
                  placeholder='Event description for public viewing'
                  isRequired
                  data-cy='description-input'
                />
              )}
            </Field>
            <Field name='status' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <FormSelect
                  formLabelProps={{
                    minW: 44,
                  }}
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
                  formLabelProps={{
                    minW: 44,
                  }}
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
                  formLabelProps={{
                    minW: 44,
                  }}
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
                  formLabelProps={{
                    minW: 44,
                  }}
                  fieldProps={fieldProps}
                  name='contactPerson'
                  label='Contact Person'
                  type='text'
                  id='contactPerson'
                  placeholder='Sir Eli'
                  isRequired
                  data-cy='contact-person-input'
                />
              )}
            </Field>
            <Field name='contactNumber' type='phone' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={{
                    minW: 44,
                  }}
                  fieldProps={fieldProps}
                  name='contactNumber'
                  label='Contact Number'
                  type='phone'
                  id='contactNumber'
                  placeholder='120'
                  isRequired
                  data-cy='contact-number-input'
                />
              )}
            </Field>
            <Field name='approvedBy' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Input
                  formLabelProps={{
                    minW: 44,
                  }}
                  fieldProps={fieldProps}
                  name='approvedBy'
                  label='Approved by'
                  type='text'
                  id='approvedBy'
                  placeholder="President's Office"
                  isRequired
                  data-cy='contact-person-input'
                />
              )}
            </Field>
            <Field name='viewAccess' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <FormSelect
                  formLabelProps={{
                    minW: 44,
                  }}
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
            <Field name='type' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <FormSelect
                  formLabelProps={{
                    minW: 44,
                  }}
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
            <Field name='additionalNotes' type='text' isRequired>
              {(fieldProps: FieldProps<string, EventCreateDTO>) => (
                <Textarea
                  formLabelProps={{
                    minW: 44,
                  }}
                  fieldProps={fieldProps}
                  name='additionalNotes'
                  label='Additional Notes'
                  id='additionalNotes'
                  placeholder='Important notes for technical staff and support'
                  isRequired
                  data-cy='additional-notes-input'
                />
              )}
            </Field>
            <Select options={options} isClearable isSearchable isMulti />
          </FormLayout>
          <Flex w='full' h='full'>
            <FormikResetButton />
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
