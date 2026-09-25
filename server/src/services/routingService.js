import { RoutingRule } from '../models/RoutingRule.js';
import { Department } from '../models/Department.js';
import { logger } from '../utils/logger.js';

export const routeIncident = async ({ category, subcategory, location, urgency }) => {
  try {
    const jurisdiction = location?.jurisdiction || location?.city || 'ALL';

    // 1. Search for specific rule: matching category, subcategory, and jurisdiction
    const activeRules = await RoutingRule.find({ active: true })
      .sort({ priority: -1 })
      .populate('departmentId');

    let matchedRule = null;

    // First pass: exact category and subcategory match
    matchedRule = activeRules.find(rule => {
      const matchCat = rule.category.toLowerCase() === (category || '').toLowerCase();
      const matchSub = rule.subcategory === '*' || (subcategory && rule.subcategory.toLowerCase() === subcategory.toLowerCase());
      const matchJuris = rule.jurisdiction === 'ALL' || (jurisdiction && rule.jurisdiction.toLowerCase() === jurisdiction.toLowerCase());
      return matchCat && matchSub && matchJuris;
    });

    // Second pass: wildcard subcategory match
    if (!matchedRule) {
      matchedRule = activeRules.find(rule => {
        const matchCat = rule.category.toLowerCase() === (category || '').toLowerCase();
        return matchCat && (rule.jurisdiction === 'ALL' || rule.jurisdiction.toLowerCase() === (jurisdiction || '').toLowerCase());
      });
    }

    // Third pass: category substring match
    if (!matchedRule) {
      matchedRule = activeRules.find(rule => {
        return (category || '').toLowerCase().includes(rule.category.toLowerCase()) ||
               rule.category.toLowerCase().includes((category || '').toLowerCase());
      });
    }

    if (matchedRule && matchedRule.departmentId) {
      return {
        success: true,
        departmentId: matchedRule.departmentId._id,
        departmentName: matchedRule.departmentId.name,
        departmentCode: matchedRule.departmentId.code,
        channel: matchedRule.channel,
        ruleId: matchedRule._id,
        routingRationale: `Matched deterministic rule: "${matchedRule.name}" based on category: ${matchedRule.category}`,
        fallbackUsed: false,
      };
    }

    // Fallback: Assign to General Public Grievance Desk
    const fallbackDept = await Department.findOne({ code: 'GENERAL', active: true });
    if (fallbackDept) {
      return {
        success: true,
        departmentId: fallbackDept._id,
        departmentName: fallbackDept.name,
        departmentCode: fallbackDept.code,
        channel: fallbackDept.routingChannel || 'MANUAL_QUEUE',
        ruleId: null,
        routingRationale: 'No direct category rule matched. Routed to General Desk manual review queue.',
        fallbackUsed: true,
      };
    }

    // Total routing failure fallback
    return {
      success: false,
      departmentId: null,
      departmentName: null,
      departmentCode: null,
      channel: 'MANUAL_QUEUE',
      ruleId: null,
      routingRationale: 'Deterministic routing failed: No eligible department found.',
      fallbackUsed: true,
    };
  } catch (error) {
    logger.error('Error executing deterministic routing:', error);
    return {
      success: false,
      departmentId: null,
      routingRationale: error.message,
      fallbackUsed: true,
    };
  }
};
