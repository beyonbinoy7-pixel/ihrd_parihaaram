import { colleges } from '../data/colleges.js';

/**
 * Hashtag Service
 * Handles hashtag extraction, case normalization, database resolution, and student college authority validation.
 */

// Regex for extracting hashtags (e.g. #CEK, #cek, #CET)
const HASHTAG_REGEX = /#([a-zA-Z0-9_]+)/g;

/**
 * Extract all raw hashtag strings from an input text.
 * @param {string} text
 * @returns {string[]} Array of hashtags e.g. ["#CEK", "#CET"]
 */
export const extractHashtags = (text) => {
  if (!text || typeof text !== 'string') return [];
  const matches = text.match(HASHTAG_REGEX);
  if (!matches) return [];
  // Return unique normalized hashtags
  return Array.from(new Set(matches.map(h => normalizeHashtag(h))));
};

/**
 * Normalize hashtag string to canonical uppercase e.g. #cek -> #CEK
 * @param {string} tag
 * @returns {string}
 */
export const normalizeHashtag = (tag) => {
  if (!tag) return '';
  const clean = tag.trim().replace(/^#+/, '');
  return `#${clean.toUpperCase()}`;
};

/**
 * Resolve a hashtag to a registered College model in the database.
 * @param {string} tag
 * @returns {Object|null} College object or null if not found
 */
export const resolveCollegeHashtag = (tag) => {
  const normalized = normalizeHashtag(tag);
  if (!normalized) return null;
  return colleges.find(c => c.hashtag.toUpperCase() === normalized) || null;
};

/**
 * Validates if a hashtag exists in registered colleges.
 * @param {string} tag
 * @returns {boolean}
 */
export const validateCollegeHashtag = (tag) => {
  return resolveCollegeHashtag(tag) !== null;
};

/**
 * Checks for conflict between student's registered college and detected hashtag.
 * Enforces highest authority: Authenticated student college identity.
 * @param {string} studentCollegeCode e.g. "CEK"
 * @param {string} tag e.g. "#CET"
 * @returns {Object} Conflict analysis result
 */
export const checkCollegeConflict = (studentCollegeCode, tag) => {
  const detectedCollege = resolveCollegeHashtag(tag);
  if (!detectedCollege) {
    return {
      hasConflict: false,
      isUnknown: true,
      message: `Hashtag ${tag} is not a registered PARIHAARAM college.`,
      detectedCollege: null
    };
  }

  const matchesStudentCollege = detectedCollege.code.toUpperCase() === studentCollegeCode.toUpperCase();
  
  if (!matchesStudentCollege) {
    return {
      hasConflict: true,
      isUnknown: false,
      message: `This hashtag (${detectedCollege.hashtag} - ${detectedCollege.name}) belongs to another college. Your report will still be assigned to your registered college (${studentCollegeCode}). Please verify location.`,
      detectedCollege
    };
  }

  return {
    hasConflict: false,
    isUnknown: false,
    message: `Valid college hashtag for ${detectedCollege.name}`,
    detectedCollege
  };
};

/**
 * Search registered colleges by code, hashtag, or name query for auto-complete dropdowns.
 * @param {string} query
 * @returns {Object[]} Matching college objects
 */
export const searchCollegeHashtags = (query) => {
  if (!query) return colleges;
  const q = query.trim().toLowerCase().replace(/^#/, '');
  return colleges.filter(c => 
    c.code.toLowerCase().includes(q) ||
    c.hashtag.toLowerCase().includes(`#${q}`) ||
    c.name.toLowerCase().includes(q)
  );
};
