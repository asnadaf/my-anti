import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; ${Object.entries(COOKIE_OPTIONS)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')}`);
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; ${Object.entries({
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')}`);
}

export function getAuthToken(req) {
  const cookies = req.cookies;
  return cookies[COOKIE_NAME];
}

export async function requireAuth(req, res, next) {
  if (!req || !res) {
    // Client-side context
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1];

    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
      window.location.href = '/auth/login';
      return;
    }

    return decoded;
  }

  // Server-side context
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    clearAuthCookie(res);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

export async function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
} 