import { colleges } from '../data/colleges.js';

/**
 * Leaderboard Service
 * Evaluates colleges using the multi-metric weighted formula with sample size confidence weighting.
 */

export const LEADERBOARD_WEIGHTS = {
  RESOLUTION_RATE: 0.40,
  RESOLUTION_SPEED: 0.25,
  STUDENT_SATISFACTION: 0.15,
  PENDING_REDUCTION: 0.10,
  SLA_QUALITY: 0.10,
};

const MIN_SAMPLE_THRESHOLD = 5;

/**
 * Calculate performance score for a single college model.
 */
export const calculateCollegeScore = (college) => {
  const {
    totalProblems = 0,
    resolvedProblems = 0,
    pendingProblems = 0,
    avgResolutionTimeHours = 24,
    studentSatisfaction = 4.0,
    slaCompliance = 90.0,
  } = college;

  // 1. Resolution Rate (0-100)
  const resRate = totalProblems > 0 ? (resolvedProblems / totalProblems) * 100 : 100;

  // 2. Speed Score (0-100): 4 hours = 100%, 72 hours = 0%
  const speedScore = Math.max(0, Math.min(100, 100 - ((avgResolutionTimeHours - 4) / 68) * 100));

  // 3. Satisfaction Score (0-100): 5 star = 100%
  const satisfactionScore = (studentSatisfaction / 5.0) * 100;

  // 4. Pending Reduction Score (0-100)
  const pendingScore = totalProblems > 0 ? Math.max(0, 100 - (pendingProblems / totalProblems) * 100) : 100;

  // 5. SLA Quality (0-100)
  const qualityScore = slaCompliance;

  // Raw weighted score
  const rawScore = 
    (resRate * LEADERBOARD_WEIGHTS.RESOLUTION_RATE) +
    (speedScore * LEADERBOARD_WEIGHTS.RESOLUTION_SPEED) +
    (satisfactionScore * LEADERBOARD_WEIGHTS.STUDENT_SATISFACTION) +
    (pendingScore * LEADERBOARD_WEIGHTS.PENDING_REDUCTION) +
    (qualityScore * LEADERBOARD_WEIGHTS.SLA_QUALITY);

  // Confidence Weighting (prevents 2/2 resolved from beating 450/480)
  let confidenceFactor = 1.0;
  if (totalProblems < MIN_SAMPLE_THRESHOLD) {
    confidenceFactor = 0.7 + (totalProblems / MIN_SAMPLE_THRESHOLD) * 0.3;
  }

  const finalScore = Number((rawScore * confidenceFactor).toFixed(1));

  return {
    finalScore,
    metrics: {
      resRate: Number(resRate.toFixed(1)),
      speedScore: Number(speedScore.toFixed(1)),
      satisfactionScore: Number(satisfactionScore.toFixed(1)),
      pendingScore: Number(pendingScore.toFixed(1)),
      qualityScore: Number(qualityScore.toFixed(1)),
      confidenceFactor: Number(confidenceFactor.toFixed(2))
    }
  };
};

/**
 * Returns ranked list of colleges with rank movement indicators (↑ 3, ↓ 2, —).
 */
export const getWeeklyLeaderboard = (collegesList = colleges) => {
  const evaluated = collegesList.map(c => {
    const { finalScore, metrics } = calculateCollegeScore(c);
    return {
      ...c,
      calculatedScore: finalScore,
      scoreMetrics: metrics
    };
  });

  // Sort descending by score
  evaluated.sort((a, b) => b.calculatedScore - a.calculatedScore);

  return evaluated.map((col, index) => {
    const currentRank = index + 1;
    const previousRank = col.previousRank || currentRank;
    const diff = previousRank - currentRank; // positive means improved rank

    let rankMovementText = '—';
    let movementType = 'NONE';

    if (diff > 0) {
      rankMovementText = `↑ ${diff}`;
      movementType = 'UP';
    } else if (diff < 0) {
      rankMovementText = `↓ ${Math.abs(diff)}`;
      movementType = 'DOWN';
    }

    return {
      ...col,
      currentRank,
      previousRank,
      rankMovementText,
      movementType,
      rankDiff: diff
    };
  });
};
