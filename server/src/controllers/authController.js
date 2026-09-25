import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Officer } from '../models/Officer.js';
import { logger } from '../utils/logger.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('departmentId', 'name code jurisdiction')
      .populate('officerId', 'badgeNumber rank');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          clerkUserId: user.clerkUserId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          identityVerified: user.identityVerified,
          verificationLevel: user.verificationLevel,
          accountStatus: user.accountStatus,
          department: user.departmentId,
          officer: user.officerId,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const syncUser = async (req, res, next) => {
  try {
    const { clerkUserId, name, email, phone, role } = req.body;

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = await User.create({
        clerkUserId,
        name: name || 'Citizen User',
        email: email || `${clerkUserId}@nyaymadad.citizen`,
        phone: phone || '',
        role: role || 'citizen',
        identityVerified: false,
      });
      logger.info(`Synchronized new user from Clerk: ${user._id} (${user.role})`);
    } else {
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const switchDemoPersona = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['citizen', 'officer', 'department_admin', 'system_admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid demo role. Choose from: ${validRoles.join(', ')}`,
      });
    }

    let user = await User.findOne({ role })
      .populate('departmentId')
      .populate('officerId');

    if (!user) {
      user = await User.create({
        clerkUserId: `demo_${role}_user_id`,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}`,
        email: `${role}@nyaymadad.gov.in`,
        role,
        identityVerified: true,
        verificationLevel: 'GOVT_ID',
      });
    }

    res.status(200).json({
      success: true,
      message: `Switched demo persona to ${role}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
