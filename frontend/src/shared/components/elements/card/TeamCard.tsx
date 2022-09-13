import { Flex, FlexProps, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface TeamCardProps {
  src: string;
  srcHover?: string;
  title: string;
  subtitle: string;
  role: string;
}

export const TeamCard = ({
  src,
  title,
  subtitle,
  role,
  srcHover,
}: TeamCardProps & FlexProps) => {
  const [stateSrc, setStateSrc] = useState(src);
  return (
    <Flex
      maxW={80}
      w={80}
      p={3}
      role='group'
      objectFit='cover'
      _hover={{ cursor: 'pointer' }}
      borderWidth='1px'
      rounded='lg'
      bg='foreground'
      direction='column'
      justifyContent='center'
      textAlign='center'
      onMouseEnter={() => setStateSrc(srcHover || src)}
      onMouseLeave={() => setStateSrc(src)}
    >
      <Image
        objectFit='cover'
        maxH={48}
        alt='team'
        src={stateSrc}
        rounded='lg'
        mb={2}
      />
      <Text fontWeight='bold'>{title}</Text>
      <Text fontSize='sm'>{subtitle}</Text>
      <Text fontSize='xs'>{role}</Text>
    </Flex>
  );
};
