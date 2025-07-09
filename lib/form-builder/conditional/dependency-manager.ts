// Dependency Graph Manager for Conditional Fields
// Manages field dependencies and prevents circular references

import { FieldConfig } from '../types';

export interface DependencyNode {
  fieldId: string;
  field: FieldConfig;
  dependencies: string[];
  dependents: string[];
  level: number; // Depth in dependency tree
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
  evaluationOrder: string[];
  circularDependencies: string[][];
}

export interface DependencyChange {
  type: 'add' | 'remove' | 'update';
  fieldId: string;
  oldDependencies?: string[];
  newDependencies?: string[];
}

export class DependencyManager {
  private graph: DependencyGraph;
  private fields: Map<string, FieldConfig>;

  constructor(fields: FieldConfig[] = []) {
    this.fields = new Map();
    this.graph = {
      nodes: new Map(),
      evaluationOrder: [],
      circularDependencies: [],
    };

    this.buildGraph(fields);
  }

  /**
   * Builds the complete dependency graph from fields
   */
  buildGraph(fields: FieldConfig[]): void {
    // Clear existing graph
    this.graph.nodes.clear();
    this.fields.clear();

    // Add all fields to the map
    fields.forEach(field => {
      this.fields.set(field.id, field);
    });

    // Create nodes for each field
    fields.forEach(field => {
      const dependencies = this.extractDependencies(field);
      const node: DependencyNode = {
        fieldId: field.id,
        field,
        dependencies,
        dependents: [],
        level: 0,
      };
      this.graph.nodes.set(field.id, node);
    });

    // Build dependent relationships
    this.graph.nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        const depNode = this.graph.nodes.get(depId);
        if (depNode && !depNode.dependents.includes(node.fieldId)) {
          depNode.dependents.push(node.fieldId);
        }
      });
    });

    // Calculate levels and evaluation order
    this.calculateLevels();
    this.calculateEvaluationOrder();
    this.detectCircularDependencies();
  }

  /**
   * Adds a new field to the dependency graph
   */
  addField(field: FieldConfig): DependencyChange {
    const dependencies = this.extractDependencies(field);

    // Create new node
    const node: DependencyNode = {
      fieldId: field.id,
      field,
      dependencies,
      dependents: [],
      level: 0,
    };

    this.fields.set(field.id, field);
    this.graph.nodes.set(field.id, node);

    // Update dependent relationships
    dependencies.forEach(depId => {
      const depNode = this.graph.nodes.get(depId);
      if (depNode && !depNode.dependents.includes(field.id)) {
        depNode.dependents.push(field.id);
      }
    });

    // Recalculate graph properties
    this.calculateLevels();
    this.calculateEvaluationOrder();
    this.detectCircularDependencies();

    return {
      type: 'add',
      fieldId: field.id,
      newDependencies: dependencies,
    };
  }

  /**
   * Removes a field from the dependency graph
   */
  removeField(fieldId: string): DependencyChange {
    const node = this.graph.nodes.get(fieldId);
    if (!node) {
      throw new Error(`Field ${fieldId} not found in dependency graph`);
    }

    const oldDependencies = [...node.dependencies];

    // Remove from dependents of other nodes
    node.dependencies.forEach(depId => {
      const depNode = this.graph.nodes.get(depId);
      if (depNode) {
        depNode.dependents = depNode.dependents.filter(id => id !== fieldId);
      }
    });

    // Update fields that depend on this field (remove their conditional logic)
    node.dependents.forEach(dependentId => {
      const dependentField = this.fields.get(dependentId);
      if (dependentField && dependentField.conditional) {
        dependentField.conditional.conditions = dependentField.conditional.conditions.filter(
          condition => condition.fieldId !== fieldId
        );
      }
    });

    // Remove the node
    this.graph.nodes.delete(fieldId);
    this.fields.delete(fieldId);

    // Recalculate graph properties
    this.calculateLevels();
    this.calculateEvaluationOrder();
    this.detectCircularDependencies();

    return {
      type: 'remove',
      fieldId,
      oldDependencies,
    };
  }

  /**
   * Updates a field's conditional logic in the dependency graph
   */
  updateField(field: FieldConfig): DependencyChange {
    const existingNode = this.graph.nodes.get(field.id);
    const oldDependencies = existingNode ? [...existingNode.dependencies] : [];
    const newDependencies = this.extractDependencies(field);

    if (existingNode) {
      // Remove old dependencies
      existingNode.dependencies.forEach(depId => {
        const depNode = this.graph.nodes.get(depId);
        if (depNode) {
          depNode.dependents = depNode.dependents.filter(id => id !== field.id);
        }
      });

      // Update node
      existingNode.field = field;
      existingNode.dependencies = newDependencies;
    } else {
      // Create new node if it doesn't exist
      const node: DependencyNode = {
        fieldId: field.id,
        field,
        dependencies: newDependencies,
        dependents: [],
        level: 0,
      };
      this.graph.nodes.set(field.id, node);
    }

    // Add new dependencies
    newDependencies.forEach(depId => {
      const depNode = this.graph.nodes.get(depId);
      if (depNode && !depNode.dependents.includes(field.id)) {
        depNode.dependents.push(field.id);
      }
    });

    this.fields.set(field.id, field);

    // Recalculate graph properties
    this.calculateLevels();
    this.calculateEvaluationOrder();
    this.detectCircularDependencies();

    return {
      type: 'update',
      fieldId: field.id,
      oldDependencies,
      newDependencies,
    };
  }

  /**
   * Extracts dependencies from a field's conditional logic
   */
  private extractDependencies(field: FieldConfig): string[] {
    if (!field.conditional || !field.conditional.conditions) {
      return [];
    }

    return Array.from(
      new Set(field.conditional.conditions.map(condition => condition.fieldId))
    ).filter(id => id !== field.id); // Remove self-references
  }

  /**
   * Calculates the level (depth) of each node in the dependency tree
   */
  private calculateLevels(): void {
    // Reset all levels
    this.graph.nodes.forEach(node => {
      node.level = 0;
    });

    // Calculate levels using topological sort approach
    const visited = new Set<string>();

    const calculateNodeLevel = (nodeId: string): number => {
      if (visited.has(nodeId)) {
        return this.graph.nodes.get(nodeId)?.level || 0;
      }

      visited.add(nodeId);
      const node = this.graph.nodes.get(nodeId);
      if (!node) {
        return 0;
      }

      let maxDepLevel = 0;
      node.dependencies.forEach(depId => {
        const depLevel = calculateNodeLevel(depId);
        maxDepLevel = Math.max(maxDepLevel, depLevel);
      });

      node.level = maxDepLevel + 1;
      return node.level;
    };

    this.graph.nodes.forEach((node, nodeId) => {
      calculateNodeLevel(nodeId);
    });
  }

  /**
   * Calculates the evaluation order based on dependency levels
   */
  private calculateEvaluationOrder(): void {
    const nodes = Array.from(this.graph.nodes.values());

    // Sort by level (dependencies first) and then by field order
    nodes.sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return (a.field.order || 0) - (b.field.order || 0);
    });

    this.graph.evaluationOrder = nodes.map(node => node.fieldId);
  }

  /**
   * Detects circular dependencies in the graph
   */
  private detectCircularDependencies(): void {
    this.graph.circularDependencies = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const currentPath: string[] = [];

    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        // Found a cycle
        const cycleStart = currentPath.indexOf(nodeId);
        const cycle = currentPath.slice(cycleStart).concat(nodeId);
        this.graph.circularDependencies.push(cycle);
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);
      currentPath.push(nodeId);

      const node = this.graph.nodes.get(nodeId);
      if (node) {
        for (const depId of node.dependencies) {
          if (dfs(depId)) {
            return true;
          }
        }
      }

      recursionStack.delete(nodeId);
      currentPath.pop();
      return false;
    };

    this.graph.nodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    });
  }

  /**
   * Gets the dependency graph
   */
  getGraph(): DependencyGraph {
    return {
      nodes: new Map(this.graph.nodes),
      evaluationOrder: [...this.graph.evaluationOrder],
      circularDependencies: this.graph.circularDependencies.map(cycle => [...cycle]),
    };
  }

  /**
   * Gets fields that can be referenced by a specific field (no circular deps)
   */
  getAvailableReferences(fieldId: string): FieldConfig[] {
    const availableFields: FieldConfig[] = [];

    this.fields.forEach((field, id) => {
      if (id === fieldId) {
        return;
      } // Can't reference self

      // Check if adding this reference would create a circular dependency
      const currentField = this.fields.get(fieldId);
      if (!currentField) {
        return;
      }
      const tempField = { ...currentField };
      if (!tempField.conditional) {
        tempField.conditional = {
          show: true,
          conditions: [],
          logic: 'and',
        };
      }

      // Temporarily add this dependency and check for cycles
      const tempCondition = {
        fieldId: id,
        operator: 'equals' as const,
        value: 'test',
      };

      tempField.conditional.conditions = [...tempField.conditional.conditions, tempCondition];

      const tempFields = Array.from(this.fields.values()).map(f =>
        f.id === fieldId ? tempField : f
      );

      const tempManager = new DependencyManager(tempFields);
      const hasCircular = tempManager.getGraph().circularDependencies.length > 0;

      if (!hasCircular) {
        availableFields.push(field);
      }
    });

    return availableFields;
  }

  /**
   * Gets all fields that depend on a specific field
   */
  getDependentFields(fieldId: string): FieldConfig[] {
    const node = this.graph.nodes.get(fieldId);
    if (!node) {
      return [];
    }

    return node.dependents
      .map(id => this.fields.get(id))
      .filter((field): field is FieldConfig => field !== undefined);
  }

  /**
   * Gets all fields that a specific field depends on
   */
  getDependencyFields(fieldId: string): FieldConfig[] {
    const node = this.graph.nodes.get(fieldId);
    if (!node) {
      return [];
    }

    return node.dependencies
      .map(id => this.fields.get(id))
      .filter((field): field is FieldConfig => field !== undefined);
  }

  /**
   * Validates the entire dependency graph
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for circular dependencies
    if (this.graph.circularDependencies.length > 0) {
      this.graph.circularDependencies.forEach(cycle => {
        errors.push(`Circular dependency detected: ${cycle.join(' → ')}`);
      });
    }

    // Check for missing referenced fields
    this.graph.nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        if (!this.graph.nodes.has(depId)) {
          errors.push(`Field "${node.fieldId}" references non-existent field "${depId}"`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets evaluation order for fields
   */
  getEvaluationOrder(): string[] {
    return [...this.graph.evaluationOrder];
  }

  /**
   * Gets fields that have no dependencies (can be evaluated first)
   */
  getRootFields(): FieldConfig[] {
    return Array.from(this.graph.nodes.values())
      .filter(node => node.dependencies.length === 0)
      .map(node => node.field);
  }

  /**
   * Gets fields that have no dependents (leaf nodes)
   */
  getLeafFields(): FieldConfig[] {
    return Array.from(this.graph.nodes.values())
      .filter(node => node.dependents.length === 0)
      .map(node => node.field);
  }
}

export default DependencyManager;
