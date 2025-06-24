// Liste des mots anglais communs à éviter dans les mots de passe
export const COMMON_ENGLISH_WORDS = [
  'password', 'admin', 'login', 'user', 'guest', 'test', 'demo', 'root',
  'welcome', 'hello', 'world', 'computer', 'internet', 'email', 'phone',
  'address', 'house', 'money', 'love', 'happy', 'family', 'friend',
  'school', 'work', 'office', 'home', 'time', 'life', 'people', 'person',
  'place', 'thing', 'right', 'good', 'great', 'little', 'public', 'hand',
  'company', 'number', 'group', 'problem', 'fact', 'government', 'point',
  'week', 'month', 'year', 'water', 'today', 'night', 'mother', 'father',
  'child', 'book', 'story', 'example', 'business', 'service', 'question',
  'information', 'system', 'program', 'social', 'health', 'education',
  'development', 'research', 'community', 'technology', 'security',
  'football', 'basketball', 'baseball', 'soccer', 'tennis', 'music',
  'movie', 'television', 'camera', 'picture', 'photo', 'image',
  'simple', 'easy', 'difficult', 'hard', 'important', 'different',
  'special', 'available', 'possible', 'necessary', 'similar', 'recent',
  'common', 'general', 'specific', 'national', 'international', 'local',
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  'january', 'february', 'march', 'april', 'june', 'july', 'august',
  'september', 'october', 'november', 'december', 'spring', 'summer',
  'autumn', 'winter', 'morning', 'afternoon', 'evening', 'midnight',
  'black', 'white', 'brown', 'yellow', 'green', 'blue', 'purple', 'orange',
  'red', 'pink', 'gray', 'silver', 'golden', 'light', 'dark', 'bright',
  'animal', 'horse', 'elephant', 'tiger', 'lion', 'bear', 'rabbit',
  'chicken', 'turkey', 'sheep', 'fish', 'bird', 'flower', 'tree', 'plant',
  'apple', 'orange', 'banana', 'grape', 'bread', 'cheese', 'butter',
  'coffee', 'water', 'juice', 'beer', 'wine', 'sugar', 'salt', 'pepper',
  'america', 'canada', 'mexico', 'england', 'france', 'germany', 'italy',
  'spain', 'russia', 'china', 'japan', 'australia', 'brazil', 'india',
  'london', 'paris', 'tokyo', 'madrid', 'rome', 'berlin', 'moscow',
  'american', 'canadian', 'english', 'french', 'german', 'italian',
  'spanish', 'russian', 'chinese', 'japanese', 'australian', 'indian',
  'christian', 'muslim', 'jewish', 'buddhist', 'hindu', 'catholic',
  'doctor', 'teacher', 'student', 'lawyer', 'engineer', 'manager',
  'director', 'president', 'officer', 'worker', 'employee', 'customer',
  'client', 'patient', 'driver', 'writer', 'artist', 'musician', 'actor'
];

/**
 * Vérifie si le mot de passe contient des mots anglais communs
 * @param {string} password - Le mot de passe à vérifier
 * @returns {boolean} true si le mot de passe contient des mots communs
 */
export function containsCommonWords(password) {
  const lowerPassword = password.toLowerCase();
  
  return COMMON_ENGLISH_WORDS.some(word => {
    // Vérifie si le mot apparaît tel quel dans le mot de passe
    return lowerPassword.includes(word.toLowerCase());
  });
}

/**
 * Trouve les mots communs présents dans le mot de passe
 * @param {string} password - Le mot de passe à analyser
 * @returns {string[]} Liste des mots communs trouvés
 */
export function findCommonWords(password) {
  const lowerPassword = password.toLowerCase();
  
  return COMMON_ENGLISH_WORDS.filter(word => {
    return lowerPassword.includes(word.toLowerCase());
  });
}
