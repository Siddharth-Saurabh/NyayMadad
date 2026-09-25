import { RoutingRule } from '../models/RoutingRule.js';
import { Department } from '../models/Department.js';
import { AuditLog } from '../models/AuditLog.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export const getRoutingRules = async (req, res, next) => {
  try {
    const rules = await RoutingRule.find().populate('departmentId', 'name code jurisdiction');
    res.status(200).json({
      success: true,
      data: { rules },
    });
  } catch (error) {
    next(error);
  }
};

export const createRoutingRule = async (req, res, next) => {
  try {
    const { name, category, subcategory, jurisdiction, departmentId, channel, priority } = req.body;

    if (!name || !category || !departmentId) {
      throw new ValidationError('Name, category, and departmentId are required fields.');
    }

    const rule = await RoutingRule.create({
      name,
      category,
      subcategory: subcategory || '*',
      jurisdiction: jurisdiction || 'ALL',
      departmentId,
      channel: channel || 'DIRECT_DISPATCH',
      priority: priority !== undefined ? Number(priority) : 10,
      active: true,
      verifiedBy: req.user.name,
    });

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'ROUTING_CHANGED',
      resourceType: 'RoutingRule',
      resourceId: rule._id.toString(),
      metadata: { action: 'CREATE', ruleName: name, category },
    });

    res.status(201).json({
      success: true,
      message: 'Routing rule created successfully',
      data: { rule },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoutingRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rule = await RoutingRule.findByIdAndUpdate(
      id,
      { ...req.body, lastVerifiedAt: new Date(), verifiedBy: req.user.name },
      { new: true }
    );

    if (!rule) throw new NotFoundError('Routing Rule');

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'ROUTING_CHANGED',
      resourceType: 'RoutingRule',
      resourceId: rule._id.toString(),
      metadata: { action: 'UPDATE', ruleName: rule.name },
    });

    res.status(200).json({
      success: true,
      data: { rule },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoutingRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rule = await RoutingRule.findByIdAndDelete(id);
    if (!rule) throw new NotFoundError('Routing Rule');

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'ROUTING_CHANGED',
      resourceType: 'RoutingRule',
      resourceId: id,
      metadata: { action: 'DELETE', ruleName: rule.name },
    });

    res.status(200).json({
      success: true,
      message: 'Routing rule removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, resourceType, page = 1, limit = 25 } = req.query;
    const filter = {};
    if (action && action !== 'ALL') filter.action = action;
    if (resourceType && resourceType !== 'ALL') filter.resourceType = resourceType;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('actorId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: { departments },
    });
  } catch (error) {
    next(error);
  }
};
