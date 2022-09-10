import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  Input,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Spacer,
  Text,
  useTheme,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { BiCheckCircle, BiCloudLightning } from 'react-icons/bi';
import { MainLayout } from '../../../shared/components/layout/MainLayout';
import { Theme, ThemeContext } from '../../../shared/providers/ThemeProvider';

export const Themes = () => {
  const theme = useTheme();
  const colorTokens = Object.keys(theme.colors.brand);

  const { requestThemeChange, getAvailableThemes } = useContext(ThemeContext);
  const availableThemes = getAvailableThemes();

  const handleClick = (newtheme: Theme) => {
    requestThemeChange(newtheme);
  };

  return (
    <MainLayout title='Themes'>
      <Flex gap={3}>
        {availableThemes.map((currentTheme) => (
          <Flex
            key={currentTheme.name}
            direction='column'
            gap={3}
            h={32}
            w={52}
            bg='foreground'
            borderWidth='1px'
            rounded='lg'
            p={4}
            cursor='pointer'
            borderColor={currentTheme.isCurrent ? 'brand.500' : ''}
            _hover={{}}
            onClick={() => handleClick(currentTheme)}
          >
            <Flex>
              <Text>{currentTheme.name}</Text>
              <Spacer />
              {currentTheme.isCurrent && (
                <Text>
                  <Icon as={BiCheckCircle} color='brand.500' /> Selected
                </Text>
              )}
            </Flex>
            <Spacer />
          </Flex>
        ))}
      </Flex>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        bg='foreground'
        borderWidth='1px'
        rounded='lg'
        p={5}
        gap={3}
      >
        <Flex
          direction='column'
          flexWrap='wrap'
          role='group'
          w={{ base: 'full', md: 64 }}
        >
          {colorTokens.map((token, index) => (
            <Flex
              key={index}
              w={{ base: '90%', md: 52 }}
              h={{ base: 12, md: 14 }}
              p={{ base: 2, md: 4 }}
              bg={`brand.${token}`}
              role='peer'
              transition='ease-in-out 0.1s'
              _hover={{
                w: { base: '100%', md: 60 },
                cursor: 'pointer',
                roundedRight: 'md',
              }}
            >
              <Text
                color={index >= 5 ? 'white' : 'black'}
                fontSize='sm'
              >{`brand.${token}`}</Text>
              <Spacer />
              <Text
                color={index >= 5 ? 'white' : 'black'}
                opacity={0}
                _groupHover={{ opacity: 1, mr: 0 }}
                transition='ease-in 0.25s'
                fontSize='sm'
              >
                {theme.colors.brand[token]}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          gap={{ base: 5, md: 3 }}
        >
          <GridItem colSpan={4}>
            <Button variant='solid'>Solid</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='outline'>Outline</Button>
          </GridItem>
          <GridItem colSpan={4}>
            <Input placeholder='Input' />
          </GridItem>
          <GridItem colSpan={3}>
            <RangeSlider defaultValue={[30, 80]}>
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={6} index={0}>
                <Box color='brand.500' as={BiCloudLightning} />
              </RangeSliderThumb>
              <RangeSliderThumb boxSize={6} index={1}>
                <Box color='brand.500' as={BiCloudLightning} />
              </RangeSliderThumb>
            </RangeSlider>
          </GridItem>
        </Grid>
      </Flex>
    </MainLayout>
  );
};
