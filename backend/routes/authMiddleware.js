import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  
  const token = req.header('Authorization');

  if (!token) {
    window.location.href = '/login';
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

export default authMiddleware;