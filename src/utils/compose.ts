type Func = (...args: any) => any;
type Noop = () => void;
const noop: Noop = () => null;

function pipe(): Noop;

function pipe<T extends Func>(fn: T): T;

function pipe<T extends Func, U extends Func[], R extends Func>(
  ...fns: [T, ...U, R]
): (...args: Parameters<T>) => ReturnType<R>;

function pipe(...fns: any) {
  if (fns.length === 0) return noop;
  if (fns.length === 1) return fns[0];

  return fns.reduce(
    (f: any, g: any) =>
      (...args: any) =>
        g(f(...args)),
  );
}

export default pipe;
