/**
 * Custom small scrollbar to emphaize scroll behavior
 * on critical such as in Modals
 */
export const customSmallScrollbar = {
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    width: '6px',
    borderRadius: '24px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'scrollBg',
    borderRadius: '24px',
  },
};
