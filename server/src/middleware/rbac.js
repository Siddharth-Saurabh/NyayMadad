import { AuthorizationError } from '../utils/errors.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('Authentication required before role check'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AuthorizationError(
          `Forbidden: Role '${req.user.role}' lacks permission. Required: [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
};

export const requireDepartmentAccess = (req, res, next) => {
  if (!req.user) {
    return next(new AuthorizationError('Authentication required'));
  }

  // System admin has universal access
  if (req.user.role === 'system_admin') {
    return next();
  }

  // Officers and Department Admins must have an assigned department
  if (['officer', 'department_admin'].includes(req.user.role)) {
    if (!req.user.departmentId) {
      return next(new AuthorizationError('User has no assigned department'));
    }
    return next();
  }

  return next(new AuthorizationError('Authority access restricted'));
};
