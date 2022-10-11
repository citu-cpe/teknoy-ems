import { AnnouncementDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useAnnouncements = () => {
  const api = useContext(ApiContext);

  const addAnnouncement = useMutation((announcementDTO: AnnouncementDTO) =>
    api.createAnnouncement(announcementDTO)
  );

  const editAnnouncement = useMutation((announcementDTO: AnnouncementDTO) =>
    api.updateAnnouncement(announcementDTO.id as string, announcementDTO)
  );

  const fetchAnnouncementById = useMutation((id: string) =>
    api.getAnnouncementById(id)
  );

  const fetchAllAnnouncements = useMutation(() => api.getAnnouncements());

  return {
    addAnnouncement,
    editAnnouncement,
    fetchAnnouncementById,
    fetchAllAnnouncements,
  };
};
