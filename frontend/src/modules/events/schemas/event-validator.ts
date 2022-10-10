import * as Yup from 'yup';

export const eventValidator = Yup.object({
  title: Yup.string().min(1).max(40).required('Title is required'),
  description: Yup.string().max(1000),
  type: Yup.string().min(1).max(40).required('Type is required'),
  viewAccess: Yup.string().min(1).max(40).required('View Access is required'),
  status: Yup.string().min(1).max(40).required('Status is required'),
  startTime: Yup.date().required('Start time is required'),
  endTime: Yup.date().required('End time is required'),
  contactPerson: Yup.string()
    .min(1)
    .max(40)
    .required('Contact Person is required'),
  contact: Yup.string().min(1).max(40).required('Contact is required'),
  organizerId: Yup.string().min(1).required('Organizer is required'),
  equipmentIds: Yup.array().max(30, 'Equipment must not exceed to 30'),
  venueIds: Yup.array()
    .min(1, 'Venue is required')
    .max(15, 'Venues must not exceed to 15')
    .required('Venue is required'),
  additionalNotes: Yup.string().max(250),
});
