export function makeCancelable<T>(promise: Promise<T>) {
  let canceled = false;

  const wrapped = new Promise<T>((resolve, reject) =>
    promise
      .then((v) => (canceled ? reject({ canceled: true }) : resolve(v)))
      .catch((e) => (canceled ? reject({ canceled: true }) : reject(e))),
  );

  return {
    promise: wrapped,
    cancel() {
      canceled = true;
    },
  };
}
