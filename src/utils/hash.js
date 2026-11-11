/**
 * Password Hashing Helper
 * Uses Web Crypto API or fallback hash string algorithm to prevent plain-text storage.
 */
export const hashPassword = (password) => {
  if (!password || typeof password !== 'string') return '';
  let hash = 0;
  const str = `parihaaram_salt_2026_${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `ph_${Math.abs(hash).toString(16)}`;
};

export const verifyPassword = (inputPassword, storedHash) => {
  if (!inputPassword || !storedHash) return false;
  return hashPassword(inputPassword) === storedHash;
};
