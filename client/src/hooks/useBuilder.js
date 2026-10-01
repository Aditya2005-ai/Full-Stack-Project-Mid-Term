import { useBuilderStore } from '../store/builderStore.js';

export const useBuilder = () => {
  const store = useBuilderStore();
  return {
    ...store
  };
};
