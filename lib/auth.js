import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
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
  const cookieValue = `${COOKIE_NAME}=${token}; ${Object.entries(COOKIE_OPTIONS)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')}`;
  res.setHeader('Set-Cookie', cookieValue);
}

export function clearAuthCookie(res) {
  const cookieValue = `${COOKIE_NAME}=; ${Object.entries({
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')}`;
  res.setHeader('Set-Cookie', cookieValue);
}

export function getAuthToken(req) {
  if (!req || !req.cookies) return null;
  return req.cookies[COOKIE_NAME];
}

export async function requireAuth(req, res, next) {
  if (!req || !res) {
    // Client-side context
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        window.location.href = '/auth/login';
        return null;
      }
      const user = await response.json();
      return user;
    } catch (error) {
      window.location.href = '/auth/login';
      return null;
    }
  }

  // Server-side context
  const token = getAuthToken(req);

  if (!token) {
    if (res) {
      res.status(401).json({ message: 'Authentication required' });
    }
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    if (res) {
      clearAuthCookie(res);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
    return null;
  }

  if (next) {
    req.user = decoded;
    next();
  }

  return decoded;
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