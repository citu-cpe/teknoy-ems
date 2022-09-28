import { useRef } from 'react';

export const useSelectKeys = () => {
  const organizerKey = useRef(new Date().getTime() + Math.random());
  const equipmentKey = useRef(new Date().getTime() + Math.random());
  const venueKey = useRef(new Date().getTime() + Math.random());

  return { organizerKey, equipmentKey, venueKey };
};
