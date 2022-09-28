import { Option } from '../types';

export const filterOptions = (inputValue: string, options: Option[]) => {
  return options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};
