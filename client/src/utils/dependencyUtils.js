/**
 * Client Dependency Utilities
 * Helper for UI dependency badge indicators
 */

export const getMissingDependencies = (selectedIds, moduleCatalogue) => {
  const selectedSet = new Set(selectedIds);
  const missing = [];

  for (const id of selectedIds) {
    const mod = moduleCatalogue.find(m => m.id === id);
    if (mod && mod.dependencies) {
      for (const dep of mod.dependencies) {
        if (!selectedSet.has(dep) && !missing.includes(dep)) {
          missing.push(dep);
        }
      }
    }
  }

  return missing;
};
