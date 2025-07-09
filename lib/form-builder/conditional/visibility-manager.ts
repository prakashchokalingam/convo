// Field Visibility Manager Hook
// Manages runtime visibility state for conditional fields

import { useState, useCallback, useMemo, useEffect } from 'react';

import { FieldConfig } from '../types';

import { DependencyManager } from './dependency-manager';
import { ConditionalEvaluator, EvaluationResult } from './evaluator';

export interface VisibilityState {
  [fieldId: string]: boolean;
}

export interface VisibilityManagerState {
  visibility: VisibilityState;
  evaluationResults: Record<string, EvaluationResult>;
  lastUpdated: number;
}

export interface VisibilityManagerActions {
  updateFieldValue: (fieldId: string, value: any) => void;
  updateFieldVisibility: (fieldId: string, visible: boolean) => void;
  refreshVisibility: () => void;
  resetVisibility: () => void;
  getFieldVisibility: (fieldId: string) => boolean;
  getFieldEvaluationResult: (fieldId: string) => EvaluationResult | undefined;
  getVisibleFields: () => FieldConfig[];
  getHiddenFields: () => FieldConfig[];
}

export interface UseVisibilityManagerOptions {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onVisibilityChange?: (visibility: VisibilityState) => void;
  enableDebugMode?: boolean;
}

export function useVisibilityManager({
  fields,
  initialValues = {},
  onVisibilityChange,
  enableDebugMode = false,
}: UseVisibilityManagerOptions): [VisibilityManagerState, VisibilityManagerActions] {
  // Field values state
  const [fieldValues, setFieldValues] = useState<Record<string, any>>(initialValues);

  // Visibility state
  const [state, setState] = useState<VisibilityManagerState>(() => {
    const initialVisibility: VisibilityState = {};
    const initialResults: Record<string, EvaluationResult> = {};

    fields.forEach(field => {
      initialVisibility[field.id] = true;
      initialResults[field.id] = { visible: true };
    });

    return {
      visibility: initialVisibility,
      evaluationResults: initialResults,
      lastUpdated: Date.now(),
    };
  });

  // Dependency manager for handling field relationships
  const dependencyManager = useMemo(() => {
    return new DependencyManager(fields);
  }, [fields]);

  // Evaluation context
  const evaluationContext = useMemo(
    () => ({
      fieldValues,
      fields,
    }),
    [fieldValues, fields]
  );

  // Evaluate visibility for all fields
  const evaluateVisibility = useCallback(() => {
    if (enableDebugMode) {
      console.log('Evaluating visibility with values:', fieldValues);
    }

    const evaluationOrder = dependencyManager.getEvaluationOrder();
    const newVisibility: VisibilityState = {};
    const newResults: Record<string, EvaluationResult> = {};

    // Evaluate fields in dependency order
    for (const fieldId of evaluationOrder) {
      const field = fields.find(f => f.id === fieldId);
      if (!field) {continue;}

      const result = ConditionalEvaluator.evaluateFieldVisibility(field, evaluationContext);
      newResults[fieldId] = result;
      newVisibility[fieldId] = result.visible;

      if (enableDebugMode) {
        console.log(`Field ${fieldId} visibility:`, result);
      }
    }

    // Handle fields not in evaluation order (no dependencies)
    fields.forEach(field => {
      if (!newVisibility.hasOwnProperty(field.id)) {
        const result = ConditionalEvaluator.evaluateFieldVisibility(field, evaluationContext);
        newResults[field.id] = result;
        newVisibility[field.id] = result.visible;
      }
    });

    setState(_prev => ({
      visibility: newVisibility,
      evaluationResults: newResults,
      lastUpdated: Date.now(),
    }));

    // Notify about visibility changes
    if (onVisibilityChange) {
      onVisibilityChange(newVisibility);
    }

    return newVisibility;
  }, [
    fieldValues,
    fields,
    dependencyManager,
    evaluationContext,
    onVisibilityChange,
    enableDebugMode,
  ]);

  // Update field value and trigger visibility re-evaluation
  const updateFieldValue = useCallback(
    (fieldId: string, value: any) => {
      setFieldValues(prev => {
        const newValues = { ...prev, [fieldId]: value };

        if (enableDebugMode) {
          console.log(`Field ${fieldId} value updated:`, value);
        }

        return newValues;
      });
    },
    [enableDebugMode]
  );

  // Manually update field visibility (for testing or overrides)
  const updateFieldVisibility = useCallback((fieldId: string, visible: boolean) => {
    setState(prev => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [fieldId]: visible,
      },
      lastUpdated: Date.now(),
    }));
  }, []);

  // Refresh visibility evaluation
  const refreshVisibility = useCallback(() => {
    evaluateVisibility();
  }, [evaluateVisibility]);

  // Reset all visibility to default (all visible)
  const resetVisibility = useCallback(() => {
    const resetVisibility: VisibilityState = {};
    const resetResults: Record<string, EvaluationResult> = {};

    fields.forEach(field => {
      resetVisibility[field.id] = true;
      resetResults[field.id] = { visible: true };
    });

    setState({
      visibility: resetVisibility,
      evaluationResults: resetResults,
      lastUpdated: Date.now(),
    });

    if (onVisibilityChange) {
      onVisibilityChange(resetVisibility);
    }
  }, [fields, onVisibilityChange]);

  // Get visibility for a specific field
  const getFieldVisibility = useCallback(
    (fieldId: string): boolean => {
      return state.visibility[fieldId] ?? true;
    },
    [state.visibility]
  );

  // Get evaluation result for a specific field
  const getFieldEvaluationResult = useCallback(
    (fieldId: string): EvaluationResult | undefined => {
      return state.evaluationResults[fieldId];
    },
    [state.evaluationResults]
  );

  // Get all visible fields
  const getVisibleFields = useCallback((): FieldConfig[] => {
    return fields.filter(field => state.visibility[field.id] !== false);
  }, [fields, state.visibility]);

  // Get all hidden fields
  const getHiddenFields = useCallback((): FieldConfig[] => {
    return fields.filter(field => state.visibility[field.id] === false);
  }, [fields, state.visibility]);

  // Re-evaluate visibility when field values change
  useEffect(() => {
    evaluateVisibility();
  }, [fieldValues, fields]);

  // Actions object
  const actions: VisibilityManagerActions = useMemo(
    () => ({
      updateFieldValue,
      updateFieldVisibility,
      refreshVisibility,
      resetVisibility,
      getFieldVisibility,
      getFieldEvaluationResult,
      getVisibleFields,
      getHiddenFields,
    }),
    [
      updateFieldValue,
      updateFieldVisibility,
      refreshVisibility,
      resetVisibility,
      getFieldVisibility,
      getFieldEvaluationResult,
      getVisibleFields,
      getHiddenFields,
    ]
  );

  return [state, actions];
}

// Utility hook for managing form values with conditional fields
export function useConditionalFormValues(
  fields: FieldConfig[],
  initialValues: Record<string, any> = {}
) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [visibilityState, visibilityActions] = useVisibilityManager({
    fields,
    initialValues,
    onVisibilityChange: visibility => {
      // Clear values for hidden fields
      setValues(prev => {
        const newValues = { ...prev };
        Object.keys(visibility).forEach(fieldId => {
          if (!visibility[fieldId] && newValues.hasOwnProperty(fieldId)) {
            delete newValues[fieldId];
          }
        });
        return newValues;
      });
    },
  });

  const updateValue = useCallback(
    (fieldId: string, value: any) => {
      setValues(prev => ({ ...prev, [fieldId]: value }));
      visibilityActions.updateFieldValue(fieldId, value);
    },
    [visibilityActions]
  );

  const getValue = useCallback(
    (fieldId: string) => {
      return values[fieldId];
    },
    [values]
  );

  const getVisibleValues = useCallback(() => {
    const visibleFields = visibilityActions.getVisibleFields();
    const visibleValues: Record<string, any> = {};

    visibleFields.forEach(field => {
      if (values.hasOwnProperty(field.id)) {
        visibleValues[field.id] = values[field.id];
      }
    });

    return visibleValues;
  }, [values, visibilityActions]);

  return {
    values,
    visibilityState,
    visibilityActions,
    updateValue,
    getValue,
    getVisibleValues,
    setValues,
  };
}

export default useVisibilityManager;
