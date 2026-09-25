import { ValidationError } from './errors.js';

// Strict State Transition Graph
export const ALLOWED_TRANSITIONS = {
  DRAFT: ['SUBMITTED', 'ROUTING_FAILED'],
  SUBMITTED: ['ROUTING', 'ROUTED', 'ROUTING_FAILED'],
  ROUTING: ['ROUTED', 'ROUTING_FAILED'],
  ROUTED: ['RECEIVED', 'UNDER_REVIEW', 'TRANSFERRED'],
  RECEIVED: ['UNDER_REVIEW', 'ACCEPTED', 'TRANSFERRED', 'CLOSED'],
  UNDER_REVIEW: ['INFORMATION_REQUESTED', 'ACCEPTED', 'ASSIGNED', 'INVESTIGATION', 'PROCESSING', 'TRANSFERRED', 'CLOSED'],
  INFORMATION_REQUESTED: ['UNDER_REVIEW', 'ACCEPTED', 'ASSIGNED', 'INVESTIGATION'],
  ACCEPTED: ['ASSIGNED', 'PROCESSING', 'INVESTIGATION', 'TRANSFERRED'],
  ASSIGNED: ['PROCESSING', 'INVESTIGATION', 'INFORMATION_REQUESTED', 'RESOLVED', 'CLOSED', 'TRANSFERRED'],
  PROCESSING: ['INVESTIGATION', 'INFORMATION_REQUESTED', 'RESOLVED', 'CLOSED', 'TRANSFERRED'],
  INVESTIGATION: ['INFORMATION_REQUESTED', 'RESOLVED', 'CLOSED', 'TRANSFERRED'],
  RESOLVED: ['CLOSED', 'UNDER_REVIEW'],
  CLOSED: ['UNDER_REVIEW'], // Reopening requires administrative review
  TRANSFERRED: ['ROUTED', 'RECEIVED', 'UNDER_REVIEW'],
  ROUTING_FAILED: ['ROUTED', 'UNDER_REVIEW', 'CLOSED'],
};

export const validateStatusTransition = (fromStatus, toStatus, userRole = 'citizen') => {
  if (fromStatus === toStatus) return true;

  const validNextStates = ALLOWED_TRANSITIONS[fromStatus];
  if (!validNextStates || !validNextStates.includes(toStatus)) {
    throw new ValidationError(
      `Invalid status transition from '${fromStatus}' to '${toStatus}'. Allowed: [${(validNextStates || []).join(', ')}]`
    );
  }

  // Citizens can only submit drafts or provide info
  if (userRole === 'citizen') {
    if (fromStatus === 'DRAFT' && toStatus === 'SUBMITTED') return true;
    if (fromStatus === 'INFORMATION_REQUESTED' && toStatus === 'UNDER_REVIEW') return true;
    throw new ValidationError(`Citizens are not permitted to change status to '${toStatus}'`);
  }

  return true;
};
