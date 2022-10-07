import { Button, Flex, FormLabel, Spacer, Text } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  AnnouncementReportFilterDTO,
  EquipmentReportFilterDTO,
  EventReportFilterDTO,
  OrganizerReportFilterDTO,
  ReportGetDTO,
  VenueReportFilterDTO,
} from 'generated-api';
import fileDownload from 'js-file-download';
import moment from 'moment';
import {
  Checkbox,
  FormLayout,
  Textarea,
} from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { clearEmptyObjects } from '../../../shared/helpers/';
import { useToast } from '../../../shared/hooks';
import { useReports } from '../hooks';
import { filterGroupProps, formControlProps, formLabelProps } from '../styles';
import { SelectAllToggle } from './SelectAllToggle';

export const ReportForm = () => {
  const { getReport } = useReports();
  const toast = useToast();

  // initialize checkbox filter groups as empty arrays
  const initialValues: any = {
    message: '',
    reportFilterDTO: {
      eventReportFilterDTO: [],
      announcementReportFilterDTO: [],
      equipmentReportFilterDTO: [],
      organizerReportFilterDTO: [],
      venueReportFilterDTO: [],
    },
  };

  const onSubmit = (submittedReportGetDTO: any) => {
    const reportGetDTO: ReportGetDTO = {
      ...submittedReportGetDTO,
      reportFilterDTO: {
        ...convertFieldsToFilterObject(submittedReportGetDTO),
      },
    };

    // remove empty objects
    clearEmptyObjects(reportGetDTO);

    if (reportGetDTO?.reportFilterDTO === undefined) {
      toast({
        title: 'Report export failed',
        description: 'Select at least 1 filter',
        status: 'error',
      });
      return;
    }

    exportReport(reportGetDTO);
  };

  const convertFieldsToFilterObject = (submittedReportGetDTO: any) => {
    // destructure filter fields because they are type Arrays at this point
    const {
      eventReportFilterDTO: eventSelectedFilter,
      announcementReportFilterDTO: announcementSelectedFilter,
      equipmentReportFilterDTO: equipmentSelectedFilter,
      organizerReportFilterDTO: organizerSelectedFilter,
      venueReportFilterDTO: venueSelectedFilter,
    } = submittedReportGetDTO.reportFilterDTO;

    // prepare filter objects
    let eventReportFilterDTO: EventReportFilterDTO = {};
    let announcementReportFilterDTO: AnnouncementReportFilterDTO = {};
    let equipmentReportFilterDTO: EquipmentReportFilterDTO = {};
    let organizerReportFilterDTO: OrganizerReportFilterDTO = {};
    let venueReportFilterDTO: VenueReportFilterDTO = {};

    if (isFilterNotEmpty(eventSelectedFilter)) {
      eventReportFilterDTO = {
        id: eventSelectedFilter?.includes('id'),
        title: eventSelectedFilter?.includes('title'),
        description: eventSelectedFilter?.includes('description'),
        status: eventSelectedFilter?.includes('status'),
        startTime: eventSelectedFilter?.includes('startTime'),
        endTime: eventSelectedFilter?.includes('endTime'),
        contactPerson: eventSelectedFilter?.includes('contactPerson'),
        contactNumber: eventSelectedFilter?.includes('contactNumber'),
        approvedBy: eventSelectedFilter?.includes('approvedBy'),
        viewAccess: eventSelectedFilter?.includes('viewAccess'),
        type: eventSelectedFilter?.includes('type'),
        additionalNotes: eventSelectedFilter?.includes('additionalNotes'),
        organizer: eventSelectedFilter?.includes('organizer'),
        encodedBy: eventSelectedFilter?.includes('encodedBy'),
        equipments: eventSelectedFilter?.includes('equipments'),
        venues: eventSelectedFilter?.includes('venues'),
      };
    }

    if (isFilterNotEmpty(venueSelectedFilter)) {
      venueReportFilterDTO = {
        id: venueSelectedFilter?.includes('id'),
        name: venueSelectedFilter?.includes('name'),
        notes: venueSelectedFilter?.includes('notes'),
        schedule: venueSelectedFilter?.includes('schedule'),
      };
    }

    if (isFilterNotEmpty(organizerSelectedFilter)) {
      organizerReportFilterDTO = {
        id: organizerSelectedFilter?.includes('id'),
        name: organizerSelectedFilter?.includes('name'),
        type: organizerSelectedFilter?.includes('type'),
      };
    }

    if (isFilterNotEmpty(equipmentSelectedFilter)) {
      equipmentReportFilterDTO = {
        id: equipmentSelectedFilter?.includes('id'),
        name: equipmentSelectedFilter?.includes('name'),
        type: equipmentSelectedFilter?.includes('type'),
        brand: equipmentSelectedFilter?.includes('brand'),
        serial: equipmentSelectedFilter?.includes('serial'),
        schedules: equipmentSelectedFilter?.includes('schedules'),
        notes: equipmentSelectedFilter?.includes('notes'),
      };
    }

    if (isFilterNotEmpty(announcementSelectedFilter)) {
      announcementReportFilterDTO = {
        id: announcementSelectedFilter?.includes('id'),
        title: announcementSelectedFilter?.includes('title'),
        subtitle: announcementSelectedFilter?.includes('subtitle'),
        content: announcementSelectedFilter?.includes('content'),
        tags: announcementSelectedFilter?.includes('tags'),
        viewAccess: announcementSelectedFilter?.includes('viewAccess'),
      };
    }

    return {
      eventReportFilterDTO,
      organizerReportFilterDTO,
      venueReportFilterDTO,
      equipmentReportFilterDTO,
      announcementReportFilterDTO,
    };
  };

  /**
   * Special helper function to check whether a `filter` Field value is valid
   */
  const isFilterNotEmpty = (field: any) => {
    return !!field && Array.isArray(field) && field.length > 0;
  };

  const exportReport = (reportGetDTO: ReportGetDTO) => {
    getReport.mutate(reportGetDTO, {
      onSuccess: (response) => {
        const filename = generateReportFilename();

        const blobParts = [response.data] as BlobPart[];

        fileDownload(new Blob(blobParts), filename);

        toast({ title: 'Report generated successfully' });
      },
      onError: (response) => {
        toast({
          title: 'Report export failed',
          description: 'Please try again later',
          status: 'error',
        });
      },
    });
  };

  const generateReportFilename = () => {
    const prefix = 'TEMS-Reports-';
    const timestamp = moment().format('YYYYMMDDhhmm');
    const fileExtension = '.xlsx';
    return prefix + timestamp + fileExtension;
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {() => (
        <Form noValidate>
          <FormLayout gap={10}>
            <Flex direction='column' borderBottomWidth='1px' pb={6}>
              <Text>
                Each entity has unique properties, please check the checkboxes
                below to include them.
                <br />
                Then, click <strong>Export Report</strong> to download the
                report.
              </Text>
              <Text></Text>
            </Flex>
            <Flex {...filterGroupProps}>
              <Flex {...formControlProps}>
                <FormLabel {...formLabelProps}>Events</FormLabel>
                <Flex direction='column' gap={0}>
                  <SelectAllToggle
                    fieldName='reportFilterDTO.eventReportFilterDTO'
                    onSelectValue={[
                      'id',
                      'title',
                      'description',
                      'status',
                      'startTime',
                      'endTime',
                      'contactPerson',
                      'contactNumber',
                      'approvedBy',
                      'viewAccess',
                      'type',
                      'additionalNotes',
                      'organizer',
                      'encodedBy',
                      'equipments',
                      'venues',
                    ]}
                    onDeselectValue={[]}
                  />
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'id'}
                  >
                    {(fieldProps: FieldProps<string, boolean>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-id'
                        data-cy='event-id-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'title'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-title'
                        data-cy='event-title-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'description'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-description'
                        data-cy='event-description-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'status'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-status'
                        data-cy='event-status-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'startTime'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-startTime'
                        data-cy='event-startTime-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'endTime'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-endTime'
                        data-cy='event-endTime-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'contactPerson'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-contactPerson'
                        data-cy='event-contact-person-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'contactNumber'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-contactNumber'
                        data-cy='event-contact-number-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'approvedBy'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-approvedBy'
                        data-cy='event-approved-by-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'viewAccess'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-viewAccess'
                        data-cy='event-view-access-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'additionalNotes'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-additionalNotes'
                        data-cy='event-additional-notes-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'organizer'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-organizer'
                        data-cy='event-organizer-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'encodedBy'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-encodedBy'
                        data-cy='event-encoded-by-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'equipments'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-equipments'
                        data-cy='event-equipments-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.eventReportFilterDTO'
                    type='checkbox'
                    value={'venues'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.eventReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='event-venues'
                        data-cy='event-venues-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                </Flex>
              </Flex>

              <Flex direction='column' gap={10} w='full'>
                <Flex {...formControlProps}>
                  <FormLabel {...formLabelProps}>Organizer</FormLabel>
                  <Flex direction='column' gap={0}>
                    <SelectAllToggle
                      fieldName='reportFilterDTO.organizerReportFilterDTO'
                      onSelectValue={['id', 'name', 'type']}
                      onDeselectValue={[]}
                    />
                    <Field
                      name='reportFilterDTO.organizerReportFilterDTO'
                      type='checkbox'
                      value={'id'}
                    >
                      {(fieldProps: FieldProps<string, boolean>) => (
                        <Checkbox
                          fieldProps={fieldProps}
                          name='reportFilterDTO.organizerReportFilterDTO'
                          checked={fieldProps.field.checked}
                          id='organizer-id'
                          data-cy='organizer-id-checkbox'
                        >
                          {fieldProps.field.value}
                        </Checkbox>
                      )}
                    </Field>
                    <Field
                      name='reportFilterDTO.organizerReportFilterDTO'
                      type='checkbox'
                      value={'name'}
                    >
                      {(fieldProps: FieldProps<string, string>) => (
                        <Checkbox
                          fieldProps={fieldProps}
                          name='reportFilterDTO.organizerReportFilterDTO'
                          checked={fieldProps.field.checked}
                          id='organizer-name'
                          data-cy='organizer-name-checkbox'
                        >
                          {fieldProps.field.value}
                        </Checkbox>
                      )}
                    </Field>
                    <Field
                      name='reportFilterDTO.organizerReportFilterDTO'
                      type='checkbox'
                      value={'type'}
                    >
                      {(fieldProps: FieldProps<string, string>) => (
                        <Checkbox
                          fieldProps={fieldProps}
                          name='reportFilterDTO.organizerReportFilterDTO'
                          checked={fieldProps.field.checked}
                          id='organizer-type'
                          data-cy='organizer-type-checkbox'
                        >
                          {fieldProps.field.value}
                        </Checkbox>
                      )}
                    </Field>
                  </Flex>
                </Flex>

                <Flex {...formControlProps}>
                  <FormLabel {...formLabelProps}>Venue</FormLabel>
                  <Flex direction='column' gap={0}>
                    <SelectAllToggle
                      fieldName='reportFilterDTO.venueReportFilterDTO'
                      onSelectValue={['id', 'name', 'notes', 'schedule']}
                      onDeselectValue={[]}
                    />
                    <Field
                      name='reportFilterDTO.venueReportFilterDTO'
                      type='checkbox'
                      value={'id'}
                    >
                      {(fieldProps: FieldProps<string, boolean>) => (
                        <Checkbox
                          fieldProps={fieldProps}
                          name='reportFilterDTO.venueReportFilterDTO'
                          checked={fieldProps.field.checked}
                          id='venue-id'
                          data-cy='venue-id-checkbox'
                        >
                          {fieldProps.field.value}
                        </Checkbox>
                      )}
                    </Field>
                    <Field
                      name='reportFilterDTO.venueReportFilterDTO'
                      type='checkbox'
                      value={'name'}
                    >
                      {(fieldProps: FieldProps<string, string>) => (
                        <Checkbox
                          fieldProps={fieldProps}
                          name='reportFilterDTO.venueReportFilterDTO'
                          checked={fieldProps.field.checked}
                          id='venue-name'
                          data-cy='venue-name-checkbox'
                        >
                          {fieldProps.field.value}
                        </Checkbox>
                      )}
                    </Field>
                    <Field
                      name='reportFilterDTO.venueReportFilterDTO'
                      type='checkbox'
                      value={'schedule'}
                    >
                      {(fieldProps: FieldProps<string, string>) => (
                        <Checkbox
                          fieldProps={fieldProps}
                          name='reportFilterDTO.venueReportFilterDTO'
                          checked={fieldProps.field.checked}
                          id='venue-schedule'
                          data-cy='venue-schedule-checkbox'
                        >
                          {fieldProps.field.value}
                        </Checkbox>
                      )}
                    </Field>
                    <Field
                      name='reportFilterDTO.venueReportFilterDTO'
                      type='checkbox'
                      value={'notes'}
                    >
                      {(fieldProps: FieldProps<string, string>) => (
                        <Checkbox
                          fieldProps={fieldProps}
                          name='reportFilterDTO.venueReportFilterDTO'
                          checked={fieldProps.field.checked}
                          id='venue-notes'
                          data-cy='venue-notes-checkbox'
                        >
                          {fieldProps.field.value}
                        </Checkbox>
                      )}
                    </Field>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>

            <Flex {...filterGroupProps}>
              <Flex {...formControlProps}>
                <FormLabel {...formLabelProps}>Announcement</FormLabel>
                <Flex direction='column' gap={0}>
                  <SelectAllToggle
                    fieldName='reportFilterDTO.announcementReportFilterDTO'
                    onSelectValue={[
                      'id',
                      'title',
                      'subtitle',
                      'content',
                      'tags',
                      'viewAccess',
                    ]}
                    onDeselectValue={[]}
                  />
                  <Field
                    name='reportFilterDTO.announcementReportFilterDTO'
                    type='checkbox'
                    value={'id'}
                  >
                    {(fieldProps: FieldProps<string, boolean>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.announcementReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='announcement-id'
                        data-cy='announcement-id-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.announcementReportFilterDTO'
                    type='checkbox'
                    value={'title'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.announcementReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='announcement-title'
                        data-cy='announcement-title-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.announcementReportFilterDTO'
                    type='checkbox'
                    value={'subtitle'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.announcementReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='announcement-subtitle'
                        data-cy='announcement-subtitle-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.announcementReportFilterDTO'
                    type='checkbox'
                    value={'content'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.announcementReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='announcement-content'
                        data-cy='announcement-content-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.announcementReportFilterDTO'
                    type='checkbox'
                    value={'tags'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.announcementReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='announcement-tags'
                        data-cy='announcement-tags-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.announcementReportFilterDTO'
                    type='checkbox'
                    value={'viewAccess'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.announcementReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='announcement-viewAccess'
                        data-cy='announcement-view-access-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                </Flex>
              </Flex>

              <Flex {...formControlProps}>
                <FormLabel {...formLabelProps}>Equipment</FormLabel>
                <Flex direction='column' gap={0}>
                  <SelectAllToggle
                    fieldName='reportFilterDTO.equipmentReportFilterDTO'
                    onSelectValue={[
                      'id',
                      'name',
                      'type',
                      'brand',
                      'serial',
                      'notes',
                      'schedules',
                    ]}
                    onDeselectValue={[]}
                  />
                  <Field
                    name='reportFilterDTO.equipmentReportFilterDTO'
                    type='checkbox'
                    value={'id'}
                  >
                    {(fieldProps: FieldProps<string, boolean>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.equipmentReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='equipment-id'
                        data-cy='equipment-id-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.equipmentReportFilterDTO'
                    type='checkbox'
                    value={'name'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.equipmentReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='equipment-name'
                        data-cy='equipment-name-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.equipmentReportFilterDTO'
                    type='checkbox'
                    value={'type'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.equipmentReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='equipment-type'
                        data-cy='equipment-type-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.equipmentReportFilterDTO'
                    type='checkbox'
                    value={'brand'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.equipmentReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='equipment-brand'
                        data-cy='equipment-brand-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.equipmentReportFilterDTO'
                    type='checkbox'
                    value={'serial'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.equipmentReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='equipment-serial'
                        data-cy='equipment-serial-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.equipmentReportFilterDTO'
                    type='checkbox'
                    value={'schedules'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.equipmentReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='equipment-schedules'
                        data-cy='equipment-schedules-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                  <Field
                    name='reportFilterDTO.equipmentReportFilterDTO'
                    type='checkbox'
                    value={'notes'}
                  >
                    {(fieldProps: FieldProps<string, string>) => (
                      <Checkbox
                        fieldProps={fieldProps}
                        name='reportFilterDTO.equipmentReportFilterDTO'
                        checked={fieldProps.field.checked}
                        id='equipment-notes'
                        data-cy='equipment-notes-checkbox'
                      >
                        {fieldProps.field.value}
                      </Checkbox>
                    )}
                  </Field>
                </Flex>
              </Flex>
            </Flex>

            <Field name='message'>
              {(fieldProps: FieldProps<string, ReportGetDTO>) => (
                <Textarea
                  fieldProps={fieldProps}
                  formLabelProps={formLabelProps}
                  name='message'
                  label='Message'
                  id='message'
                  placeholder='Report message'
                  data-cy='message-input'
                />
              )}
            </Field>
          </FormLayout>

          <Flex w='full' h='full' borderTopWidth='1px' pt={6}>
            <FormikResetButton>Reset Filters</FormikResetButton>
            <Spacer />
            <Button
              variant='solid'
              data-cy='report-submit-btn'
              formNoValidate
              type='submit'
              isLoading={getReport.isLoading}
              loadingText='Exporting...'
            >
              Export Report
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
