import { useBuildStore } from '../store/buildStore.js';

export const useBuilds = () => {
  const store = useBuildStore();
  return {
    ...store
  };
};
