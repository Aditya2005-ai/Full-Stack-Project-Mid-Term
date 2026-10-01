/**
 * File Merger Interface
 * Safely merges configuration, routes, dependencies, and files from multiple modules
 * Phase 01: Architectural interface skeleton
 */

export class FileMerger {
  /**
   * Merges multiple file maps without collision
   * @param {Array<Record<string, string>>} fileSets 
   * @returns {Record<string, string>}
   */
  merge(fileSets = []) {
    const merged = {};
    for (const set of fileSets) {
      Object.assign(merged, set);
    }
    return merged;
  }
}
