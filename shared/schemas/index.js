/**
 * Shared Schemas / Data Contracts
 * Defines standard shapes across Client, Server, and Generator
 */

export const ProjectConfigContract = Object.freeze({
  name: 'string',
  description: 'string',
  databaseType: 'string', // 'mongodb'
  modules: 'array',
  options: 'object'
});

export const ModuleContract = Object.freeze({
  id: 'string',
  name: 'string',
  category: 'string',
  version: 'string',
  dependencies: 'array',
  description: 'string'
});
