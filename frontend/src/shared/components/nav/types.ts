import { IconType } from 'react-icons';

export type NavItem = {
  icon?: IconType;
  hideTooltip?: boolean;
  tooltipLabel?: React.ReactNode;
};
