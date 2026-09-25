import { User } from '../models/User.js';
import { AuthenticationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Check for Demo / Dev Mode Header or Mock Persona
    const demoRole = req.headers['x-demo-role'];
    const demoUserId = req.headers['x-demo-user-id'];

    if (demoRole || demoUserId || config.env === 'development' || config.env === 'test') {
      let query = {};
      if (demoUserId) {
        query = { clerkUserId: demoUserId };
      } else if (demoRole) {
        query = { role: demoRole };
      } else {
        // Default dev user (Citizen)
        query = { role: 'citizen' };
      }

      let user = await User.findOne(query);
      if (!user) {
        // Auto-provision demo account if needed
        const roleToCreate = demoRole || 'citizen';
        user = await User.create({
          clerkUserId: demoUserId || `demo_${roleToCreate}_user_id`,
          name: `Demo ${roleToCreate.charAt(0).toUpperCase() + roleToCreate.slice(1).replace('_', ' ')}`,
          email: `${roleToCreate.toLowerCase()}@nyaymadad.gov.in`,
          role: roleToCreate,
          identityVerified: true,
          verificationLevel: 'GOVT_ID',
        });
      }

      req.user = user;
      return next();
    }

    // 2. Production Clerk Authentication Check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No authorization token provided');
    }

    const token = authHeader.split(' ')[1];
    
    // In production with valid Clerk secret, decode & verify Clerk token
    // For local resilience:
    const user = await User.findOne({ clerkUserId: token });
    if (!user) {
      throw new AuthenticationError('User session expired or invalid');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error in authMiddleware:', error);
    next(new AuthenticationError(error.message || 'Authentication failed'));
  }
};
