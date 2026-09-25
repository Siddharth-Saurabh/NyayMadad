const isDev = process.env.NODE_ENV !== 'production';

// Safe logger that strips private tokens, passwords, and sensitive keys
const sanitize = (data) => {
  if (typeof data !== 'object' || data === null) return data;
  const sanitized = { ...data };
  const sensitiveKeys = ['password', 'token', 'secret', 'otp', 'authorization', 'apiKey', 'fileHash'];
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitize(sanitized[key]);
    }
  }
  return sanitized;
};

export const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? sanitize(meta) : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? sanitize(meta) : '');
  },
  error: (msg, error = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error?.message || error);
    if (isDev && error?.stack) {
      console.error(error.stack);
    }
  },
  debug: (msg, meta = {}) => {
    if (isDev) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? sanitize(meta) : '');
    }
  }
};
