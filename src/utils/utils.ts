export const parseGameWords = (words: string) => {
  return words.split(/\r?\n/).map(word => {
    const wordArray = word.split('#');
    if (wordArray.length !== 2) {
      console.log(`This line does not follow the format: ${word}`);
      return;
    }
    return [wordArray[0].trim(), wordArray[1].trim()];
  });
};
