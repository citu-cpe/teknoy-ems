import { VenueDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useVenues = () => {
  const api = useContext(ApiContext);

  const addVenue = useMutation((venueDTO: VenueDTO) =>
    api.createVenue(venueDTO)
  );

  const editVenue = useMutation((venueDTO: VenueDTO) =>
    api.updateVenue(venueDTO.id as string, venueDTO)
  );

  const fetchVenueById = useMutation((id: string) => api.getVenueById(id));

  return {
    addVenue,
    editVenue,
    fetchVenueById,
  };
};
