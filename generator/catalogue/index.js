import { MODULE_CATALOGUE, CORE_MODULES, OPTIONAL_MODULES } from './modules.js';

export class ModuleCatalogue {
  constructor(catalogue = MODULE_CATALOGUE) {
    this.catalogue = catalogue;
  }

  getAll() {
    return [...this.catalogue];
  }

  getCore() {
    return [...CORE_MODULES];
  }

  getOptional() {
    return [...OPTIONAL_MODULES];
  }

  getById(id) {
    return this.catalogue.find(m => (m.id === id || m.key === id)) || null;
  }

  has(id) {
    return this.catalogue.some(m => (m.id === id || m.key === id));
  }
}

export { MODULE_CATALOGUE, CORE_MODULES, OPTIONAL_MODULES };
