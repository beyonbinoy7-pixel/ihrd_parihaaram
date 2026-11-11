import { extractHashtags, resolveCollegeHashtag } from '../hashtag.service';

/**
 * AI-ready College Entity Detection Service.
 * Simulates intelligent NLP entity extraction from problem titles and descriptions.
 */
export const detectCollegeEntityFromText = async (text, studentCollege = null) => {
  const hashtags = extractHashtags(text);
  
  if (hashtags.length === 0) {
    return {
      detected: false,
      hashtag: null,
      collegeId: studentCollege ? studentCollege.id : null,
      collegeName: studentCollege ? studentCollege.name : null,
      confidence: 0.0,
      reason: 'No explicit college hashtag found in text.'
    };
  }

  const primaryTag = hashtags[0];
  const college = resolveCollegeHashtag(primaryTag);

  if (!college) {
    return {
      detected: false,
      hashtag: primaryTag,
      collegeId: null,
      collegeName: null,
      confidence: 0.2,
      reason: `Hashtag ${primaryTag} is not registered in PARIHAARAM database.`
    };
  }

  return {
    detected: true,
    hashtag: college.hashtag,
    collegeId: college.id,
    collegeName: college.name,
    collegeCode: college.code,
    confidence: 1.0,
    reason: `Resolved hashtag ${primaryTag} to ${college.name}.`
  };
};
