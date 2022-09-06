import { OrganizerDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useOrganizers = () => {
  const api = useContext(ApiContext);

  const addOrganizer = useMutation((organizerDTO: OrganizerDTO) =>
    api.createNewOrganizer(organizerDTO)
  );

  const editOrganizer = useMutation((organizerDTO: OrganizerDTO) =>
    api.updateOrganizer(organizerDTO.id as string, organizerDTO)
  );

  const fetchOrganizerById = useMutation((id: string) =>
    api.getOrganizerByID(id)
  );

  return {
    addOrganizer,
    editOrganizer,
    fetchOrganizerById,
  };
};
