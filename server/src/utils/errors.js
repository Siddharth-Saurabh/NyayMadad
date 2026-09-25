export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class FileUploadError extends AppError {
  constructor(message = 'File upload failed', details = null) {
    super(message, 400, 'FILE_UPLOAD_ERROR', details);
  }
}

export class AIProviderError extends AppError {
  constructor(message = 'AI service temporarily unavailable', details = null) {
    super(message, 503, 'AI_PROVIDER_ERROR', details);
  }
}

export class RoutingError extends AppError {
  constructor(message = 'Routing determination failed', details = null) {
    super(message, 422, 'ROUTING_ERROR', details);
  }
}
