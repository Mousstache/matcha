// Utilitaires pour la validation des mots de passe côté frontend
// Version simplifiée de la liste des mots communs pour le frontend
const COMMON_WORDS_SUBSET = [
  'password', 'admin', 'login', 'user', 'guest', 'test', 'demo', 'root',
  'welcome', 'hello', 'world', 'computer', 'internet', 'email', 'phone',
  'love', 'happy', 'family', 'friend', 'home', 'work', 'office',
  'simple', 'easy', 'football', 'basketball', 'music', 'movie',
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  'january', 'february', 'march', 'april', 'june', 'july', 'august',
  'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange',
  'america', 'canada', 'france', 'england', 'london', 'paris'
];

/**
 * Vérifie si le mot de passe contient des mots anglais communs (version frontend)
 */
export function containsCommonWords(password) {
  const lowerPassword = password.toLowerCase();
  return COMMON_WORDS_SUBSET.some(word => 
    lowerPassword.includes(word.toLowerCase())
  );
}

/**
 * Trouve les mots communs dans le mot de passe (version frontend)
 */
export function findCommonWords(password) {
  const lowerPassword = password.toLowerCase();
  return COMMON_WORDS_SUBSET.filter(word => 
    lowerPassword.includes(word.toLowerCase())
  );
}

/**
 * Validation complète du mot de passe
 */
export function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Au moins 8 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins une minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins une majuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Au moins un chiffre');
  }
  
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Au moins un caractère spécial');
  }
  
  const commonWords = findCommonWords(password);
  if (commonWords.length > 0) {
    errors.push(`Ne doit pas contenir de mots communs: ${commonWords.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    commonWords
  };
}

/**
 * Calcule la force du mot de passe (0-100)
 */
export function calculatePasswordStrength(password) {
  let score = 0;
  
  // Longueur
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  
  // Complexité des caractères
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 15;
  
  // Variété de caractères
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 6) score += 5;
  if (uniqueChars >= 10) score += 5;
  
  // Pénalité pour mots communs
  if (containsCommonWords(password)) score -= 30;
  
  return Math.max(0, Math.min(100, score));
}
