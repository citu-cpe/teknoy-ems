// Solution adapted from:
// https://stackoverflow.com/questions/73395387/javascript-comparing-if-2-objects-are-the-same
export const valuesAreEqual = (first: any, second: any): boolean => {
  return JSON.stringify(first) === JSON.stringify(second);
};
