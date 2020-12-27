export const parseGameWords: (words: string) => Array<[string, string]> = (words: string) => {
  return words
    .split(/\r?\n/)
    .filter(word => word.split('#').length === 2)
    .map(word => {
      const wordArray = word.split('#');
      return [wordArray[0].trim(), wordArray[1].trim()];
    });
};
