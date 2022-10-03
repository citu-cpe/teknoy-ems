/**
 * Recursively delete any empty object members
 * @param o target object
 */
export const clearEmptyObjects = (o: any) => {
  for (var k in o) {
    if (!o[k] || typeof o[k] !== 'object') {
      continue;
    }

    clearEmptyObjects(o[k]);

    if (Object.keys(o[k]).length === 0) {
      delete o[k];
    }
  }
};
