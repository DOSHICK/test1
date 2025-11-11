
export const fetchAvailableTypes = async (): Promise<string[]> => {
  return Promise.resolve(["chainsaws", "bulldozers", "templates", "all"]);
};
