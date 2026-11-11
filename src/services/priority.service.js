import { PRIORITY } from '../data/constants.js';

/**
 * Smart Priority Service
 * Dynamically computes system priority based on safety risk factors, description keywords,
 * category urgency, and affected count.
 */

const SAFETY_KEYWORDS = [
  'crack', 'structural', 'fire', 'gas', 'leakage', 'hazard', 'dangerous', 'danger',
  'collapse', 'spark', 'short circuit', 'wire', 'exposed', 'slip', 'ceiling fall',
  'emergency', 'injure', 'injury', 'toxic', 'broken beam', 'electric shock'
];

export const calculateSmartPriority = ({
  category = '',
  title = '',
  description = '',
  studentPriority = 'MEDIUM',
  affectedCount = 1,
  building = ''
}) => {
  let score = 50; // base score out of 100
  const reasons = [];

  // 1. Text keyword search for safety risks
  const fullText = `${title} ${description} ${building}`.toLowerCase();
  const matchedKeywords = SAFETY_KEYWORDS.filter(kw => fullText.includes(kw));

  if (matchedKeywords.length > 0) {
    score += matchedKeywords.length * 20;
    reasons.push(`Safety keywords detected: "${matchedKeywords.slice(0, 3).join(', ')}"`);
  }

  // 2. Category baseline weighting
  const highRiskCategories = ['infrastructure', 'electrical', 'water', 'security'];
  if (highRiskCategories.includes(category.toLowerCase())) {
    score += 15;
    reasons.push(`High-impact category (${category})`);
  }

  // 3. Affected users multiplier
  if (affectedCount > 15) {
    score += 25;
    reasons.push(`High student impact (${affectedCount}+ affected)`);
  } else if (affectedCount > 5) {
    score += 10;
    reasons.push(`Moderate student impact (${affectedCount} affected)`);
  }

  // 4. Student priority weight
  if (studentPriority === PRIORITY.CRITICAL) {
    score += 20;
    reasons.push('Student flagged as Critical');
  } else if (studentPriority === PRIORITY.HIGH) {
    score += 10;
    reasons.push('Student flagged as High');
  }

  // Determine final priority tier
  let finalPriority = PRIORITY.LOW;
  if (score >= 85 || matchedKeywords.length >= 2) {
    finalPriority = PRIORITY.CRITICAL;
  } else if (score >= 65) {
    finalPriority = PRIORITY.HIGH;
  } else if (score >= 40) {
    finalPriority = PRIORITY.MEDIUM;
  } else {
    finalPriority = PRIORITY.LOW;
  }

  return {
    priority: finalPriority,
    priorityScore: Math.min(score, 100),
    priorityReason: reasons.join(' • ') || 'Standard priority based on category and details.'
  };
};
