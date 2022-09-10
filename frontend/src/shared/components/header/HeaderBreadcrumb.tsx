import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  forwardRef,
  HStack,
  StackProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { BackLink } from './BackLink';

export type RouteItem = {
  name: string;
  path: string;
};

export interface HeaderBreadcrumbProps extends StackProps {
  routeItems?: RouteItem[];
}
export const HeaderBreadcrumb = forwardRef<HeaderBreadcrumbProps, 'div'>(
  (props, ref) => {
    const { routeItems, ...rest } = props;

    return (
      <HStack h='4' spacing={4} opacity={0.8} {...rest}>
        <BackLink />
        {routeItems && (
          <Divider fontSize='sm' orientation='vertical' borderColor='current' />
        )}
        <Breadcrumb fontSize='sm'>
          {routeItems &&
            routeItems.map((item) => (
              <BreadcrumbItem key={item.path}>
                <NextLink href={item.path}>
                  <BreadcrumbLink
                    _hover={{ textDecoration: 'none', color: 'brand.500' }}
                  >
                    {item.name}
                  </BreadcrumbLink>
                </NextLink>
              </BreadcrumbItem>
            ))}
        </Breadcrumb>
      </HStack>
    );
  }
);
