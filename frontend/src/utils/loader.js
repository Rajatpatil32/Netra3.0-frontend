let loaderCallback = null;

export const setLoaderCallback = (cb) => {
  loaderCallback = cb;
};

export const showLoader = () => {
  if (loaderCallback) loaderCallback(true);
};

export const hideLoader = () => {
  if (loaderCallback) loaderCallback(false);
};