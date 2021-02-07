export const parseGameWords: (words: string) => Array<[string, string]> = (words: string) => {
  return words
    .split(/\r?\n/)
    .filter(word => word.split('#').length === 2)
    .map(word => {
      const wordArray = word.split('#');
      return [wordArray[0].trim(), wordArray[1].trim()];
    });
};

/**
 * The simpliest seeded random number generator I can find:
 * Mike Bostock's implementation of the Fisher–Yates algorithm.
 * See: https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
 */
export const random = (seed: number): number => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const shuffle = <T>(array: T[], seed: number): T[] => {
  // <-- ADDED ARGUMENT
  const arrayCopy: T[] = [];
  array.forEach(i => arrayCopy.push(i));
  let m = arrayCopy.length;
  let t: T;
  let i: number;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

    // And swap it with the current element.
    t = arrayCopy[m];
    arrayCopy[m] = arrayCopy[i];
    arrayCopy[i] = t;
    ++seed; // <-- ADDED LINE
  }

  return arrayCopy;
};

export const numberIncrementer = function* (originalNumber: number): Generator<number> {
  while (true) yield originalNumber++;
};

export type CallbackRef<Node = HTMLElement> = (node: Node | null) => void;
