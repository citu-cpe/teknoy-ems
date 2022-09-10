import { Tooltip } from '../elements/Tooltip';

interface NavTooltipProps {
  label: React.ReactNode;
  children: React.ReactNode;
  hideTooltip?: boolean;
}

export const NavTooltip = ({
  label,
  hideTooltip,
  children,
}: NavTooltipProps) => {
  return (
    <Tooltip label={label} placement='right' hidden={hideTooltip} hasArrow>
      {children}
    </Tooltip>
  );
};
