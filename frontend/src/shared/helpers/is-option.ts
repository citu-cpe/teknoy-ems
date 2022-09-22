import { Option } from '../types';

export const isOption = (obj: unknown): obj is Option => {
  return (obj as Option).value !== null;
};
