const getPath = () => {
  const hash = window.location.hash.slice(1);
  return hash.startsWith('/') ? hash : `/${hash}`;
};

export const installRouter = (
  locationUpdatedCallback: (path: string) => void,
) => {
  window.addEventListener('hashchange', () => {
    locationUpdatedCallback(getPath());
  });
  locationUpdatedCallback(getPath());
};
