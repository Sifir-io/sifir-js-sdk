type ShallowObject = { [key: string]: string | boolean | number | undefined };
const shallowAsQueryParam = (obj: ShallowObject) =>
  Object.entries(obj)
    .map(
      ([key, val]) =>
        val && `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .filter(x => !!x)
    .join("&");

export { shallowAsQueryParam };
