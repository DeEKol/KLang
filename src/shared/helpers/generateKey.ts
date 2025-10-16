export const key = (() => {
  let counter = 0;
  return (prefix = "k") => `${prefix}_${counter++}_${Math.random().toString(36).substring(2, 8)}`;
})();
