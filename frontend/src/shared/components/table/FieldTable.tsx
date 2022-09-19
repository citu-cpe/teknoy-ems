import { Table, TableContainer, TableProps } from '@chakra-ui/react';

/**
 * Custom `Table` for `Modal` form views
 */
export const ModalTable = ({ children, ...props }: TableProps) => {
  return (
    <TableContainer>
      <Table
        colorScheme='gray'
        variant='simple'
        w='fit-content'
        mx='auto'
        maxW='full'
        fontSize='sm'
        size='sm'
        mb={6}
        {...props}
      >
        {children}
      </Table>
    </TableContainer>
  );
};
