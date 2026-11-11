import { intents } from './chatbotConfig.js';
import { normalizeText } from '../../utils/textNormalizer.js';

export function detectIntent(input) {
  const text = normalizeText(input);
  if (!text) return { intent: 'FALLBACK', confidence: 0, ambiguous: false };
  const scores = intents.map(item => {
    let score = 0;
    for (const phrase of item.phrases) if (` ${text} `.includes(` ${normalizeText(phrase)} `)) score += 5 + normalizeText(phrase).split(' ').length;
    for (const term of item.terms) if (new RegExp(`\\b${normalizeText(term)}\\b`, 'u').test(text)) score += 2;
    for (const synonym of item.synonyms) if (` ${text} `.includes(` ${normalizeText(synonym)} `)) score += 3;
    return { intent: item.id, priority: item.priority, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || b.priority - a.priority);
  if (!scores.length) return { intent: 'FALLBACK', confidence: 0, ambiguous: false };
  const [best, next] = scores;
  const confidence = Math.min(1, best.score / (best.score + (next?.score || 0) + 2));
  const ambiguous = !!next && best.score === next.score;
  return { intent: ambiguous ? 'AMBIGUOUS' : best.intent, confidence, ambiguous };
}
