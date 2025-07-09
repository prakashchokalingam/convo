// Toast utility functions

import { toast } from '@/hooks/use-toast';

/**
 * Utility functions for showing different types of toasts
 */

export const showSuccess = (message: string, title?: string) => {
  return toast({
    variant: 'success',
    title: title || 'Success',
    description: message,
  });
};

export const showError = (message: string, title?: string) => {
  return toast({
    variant: 'destructive',
    title: title || 'Error',
    description: message,
  });
};

export const showWarning = (message: string, title?: string) => {
  return toast({
    variant: 'warning',
    title: title || 'Warning',
    description: message,
  });
};

export const showInfo = (message: string, title?: string) => {
  return toast({
    variant: 'default',
    title: title || 'Info',
    description: message,
  });
};

/**
 * Handle API response errors with appropriate toast messages
 */
export const handleApiError = (error: any, defaultMessage?: string) => {
  let message = defaultMessage || 'Something went wrong. Please try again.';

  if (typeof error === 'string') {
    message = error;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.error) {
    message = error.error;
  }

  return showError(message);
};

/**
 * Show loading toast that can be updated
 */
export const showLoading = (message: string = 'Loading...') => {
  return toast({
    title: message,
    description: 'Please wait...',
    variant: 'default',
  });
};

/**
 * Update a toast to show success
 */
export const updateToastSuccess = (toastId: string, message: string, title?: string) => {
  return toast({
    variant: 'success',
    title: title || 'Success',
    description: message,
  });
};

/**
 * Update a toast to show error
 */
export const updateToastError = (toastId: string, message: string, title?: string) => {
  return toast({
    variant: 'destructive',
    title: title || 'Error',
    description: message,
  });
};

/**
 * Common workspace-related toast messages
 */
export const workspaceToasts = {
  created: (name: string) => showSuccess(`Workspace "${name}" created successfully!`),
  inviteSent: (email: string) => showSuccess(`Invitation sent to ${email}`),
  inviteError: (email: string, error: string) => showError(`Failed to invite ${email}: ${error}`),
  memberAdded: (name: string) => showSuccess(`${name} has joined the workspace`),
  memberRemoved: (name: string) => showSuccess(`${name} has been removed from the workspace`),
  roleUpdated: (name: string, role: string) => showSuccess(`${name} is now a ${role}`),
  planLimitReached: (feature: string) =>
    showWarning(`You have reached your plan limit for ${feature}. Upgrade to continue.`),
};

/**
 * Common form-related toast messages
 */
export const formToasts = {
  saved: () => showSuccess('Form saved successfully'),
  published: () => showSuccess('Form published successfully'),
  unpublished: () => showSuccess('Form unpublished'),
  deleted: () => showSuccess('Form deleted'),
  saveError: () => showError('Failed to save form. Please try again.'),
  validationError: (message: string) => showError(message, 'Validation Error'),
};

/**
 * Network error handler
 */
export const handleNetworkError = (error: any) => {
  if (!navigator.onLine) {
    return showError('You appear to be offline. Please check your connection.');
  }

  if (error?.status === 429) {
    return showError('Too many requests. Please wait a moment and try again.');
  }

  if (error?.status >= 500) {
    return showError('Server error. Our team has been notified.');
  }

  return handleApiError(error);
};
