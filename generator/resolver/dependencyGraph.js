/**
 * Dependency Graph Data Structure
 * Phase 01: Architectural interface skeleton
 */

export class DependencyGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Set());
    }
  }

  addEdge(fromNode, toNode) {
    this.addNode(fromNode);
    this.addNode(toNode);
    this.adjacencyList.get(fromNode).add(toNode);
  }

  getDependencies(node) {
    return Array.from(this.adjacencyList.get(node) || []);
  }

  getAllNodes() {
    return Array.from(this.adjacencyList.keys());
  }
}
