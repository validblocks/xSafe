interface SwitchTrueType {
  default: any;
  [key: string]: any;
}

type ReturnKeys = 'true' | 'false';

const switchTrue = (object: SwitchTrueType): any => {
  const { default: defaultValue, ...rest } = object;
  const obj = { default: defaultValue, ...rest };
  const result = Object.keys(obj).reduce(
    (acc, cur) => ({
      ...acc,
      [cur === 'default' ? 'true' : cur]: (obj as any)[cur as ReturnKeys]
    }),
    {} as Record<ReturnKeys, any>
  );
  return result.true;
};

export default switchTrue;
