/**
 * Custom small scrollbar based on `brand` theme color
 * to emphaize scroll behavior on critical such as in Modals
 */
export const brandSmallScrollbar = {
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    width: '6px',
    backgroundColor: 'activeBg',
    borderRadius: '24px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'activeColor',
    borderRadius: '24px',
  },
};
