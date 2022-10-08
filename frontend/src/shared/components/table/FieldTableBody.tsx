import { Tbody, Td, Text, Textarea, Th, Tr } from '@chakra-ui/react';
import { PasswordField } from './PasswordField';

type TableDataType = {
  label: string | undefined | null;
  value: string | undefined | null;
  type: 'text' | 'textarea' | 'password' | undefined | null;
};

interface FieldTableBodyProps {
  data?: TableDataType[] | undefined | null;
}

export const FieldTableBody = ({ data }: FieldTableBodyProps) => {
  /**
   *
   * @param data field data
   * @returns a react fragment containing TableHeader (Th) and TableData (Td)
   */
  const getComponentType = (data: TableDataType) => {
    const { label, type, value } = data;

    if (type === 'textarea' && value) {
      return (
        <>
          <Th
            display='flex'
            justifyContent='start'
            alignItems='center'
            borderBottom='0px'
            mt={4}
          >
            {label}
          </Th>
          <Td borderBottom='0px' minW={60}>
            <Textarea
              variant='flushed'
              w='full'
              fontSize='sm'
              rows={4}
              borderBottom='0px'
              readOnly
            >
              {value?.length === 0 ? 'None' : value}
            </Textarea>
          </Td>
        </>
      );
    }

    if (type === 'password' && value) {
      return (
        <>
          <Th borderBottom='0px'>{label}</Th>
          <Td minW={60} borderBottom='0px'>
            <PasswordField password={value} />
          </Td>
        </>
      );
    }

    // just render the label and field in plain text
    return (
      <>
        <Th borderBottom='0px'>{label}</Th>
        <Td borderBottom='0px' minW={60}>
          {value?.length === 0 ? 'None' : value}
        </Td>
      </>
    );
  };

  return (
    <Tbody w='full' maxW='full'>
      {data &&
        data.map((dt, index) => (
          <Tr key={index} borderBottomWidth='1px'>
            {getComponentType(dt)}
          </Tr>
        ))}

      {!data && (
        <Tr>
          <Text>No data available</Text>
        </Tr>
      )}
    </Tbody>
  );
};
