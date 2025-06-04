import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

export const ensureEmailConfirmed = (req, res, next) => {
  console.log(req.user);
  if (!req.user.emailConfirmed) {
    return res.status(403).json({ message: 'Email non confirmé' });
  }
  next();
};

export default { authMiddleware, ensureEmailConfirmed};