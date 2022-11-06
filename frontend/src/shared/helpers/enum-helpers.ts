export const enumToArray = (obj: object) => {
  return Object.values(obj);
};

export const enumValueToCapitalCase = (value: string): string => {
  let words = value.split('_');

  words = words.map((w) => toTitleCase(w));

  return words.join(' ');
};

// https://stackoverflow.com/a/196991
export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
