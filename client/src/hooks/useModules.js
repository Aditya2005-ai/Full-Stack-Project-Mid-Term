import { useModuleStore } from '../store/moduleStore.js';

export const useModules = () => {
  const store = useModuleStore();
  return {
    ...store
  };
};
