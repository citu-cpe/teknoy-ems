export const camelToSpaceCase = (text: string): string => {
  // https://stackoverflow.com/a/7225450
  const result = text.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

  return finalResult;
};
