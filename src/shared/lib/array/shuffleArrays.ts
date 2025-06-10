const shuffleArrays = (arr1: string[], arr2: string[]) => {
  const shuffledArr1 = [...arr1].sort(() => Math.random() - 0.5);
  const shuffledArr2 = [...arr2].sort(() => Math.random() - 0.5);
  return [shuffledArr1, shuffledArr2];
};

export { shuffleArrays };
