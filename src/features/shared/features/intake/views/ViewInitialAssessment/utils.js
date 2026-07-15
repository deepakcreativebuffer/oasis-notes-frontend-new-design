/** @format */

export function getApiArrayData(startIndex, arrayLength, array) {
  if (arrayLength <= startIndex) return [];
  const arr = [];
  for (let i = startIndex; i < arrayLength; i++) arr.push(array[i]);
  return arr;
}
