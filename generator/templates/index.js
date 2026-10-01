/**
 * Template Registry
 * Phase 01: Architectural interface skeleton for templates catalogue
 */

export class TemplateRegistry {
  constructor() {
    this.templates = new Map();
  }

  register(templateName, templateConfig) {
    this.templates.set(templateName, templateConfig);
  }

  get(templateName) {
    return this.templates.get(templateName) || null;
  }
}
