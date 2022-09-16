import { AnnouncementDTO } from 'generated-api';
import { ModalInfo } from '../../../shared/components/elements';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';

interface AnnouncementAddSuccessProps {
  announcement: AnnouncementDTO | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const AnnouncementAddSuccess = ({
  announcement,
  onClose,
  onConfirm,
}: AnnouncementAddSuccessProps) => {
  return (
    <>
      <ModalInfo
        title='Announcement has been added'
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <ModalTable>
          {announcement && (
            <FieldTableBody
              data={[
                {
                  label: 'Title',
                  value: announcement?.title,
                  type: 'text',
                },
                {
                  label: 'Subtitle',
                  value: announcement?.subtitle,
                  type: 'text',
                },
                {
                  label: 'Content',
                  value: announcement?.content,
                  type: 'textarea',
                },
                {
                  label: 'Tags',
                  value: announcement?.tags.join(', '),
                  type: 'text',
                },
                {
                  label: 'Access',
                  value: announcement?.viewAccess,
                  type: 'text',
                },
              ]}
            />
          )}
        </ModalTable>
      </ModalInfo>
    </>
  );
};
