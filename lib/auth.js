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
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return null;
      }
      const user = await response.json();
      // Don't log user data for performance
      return user;
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      return null;
    }
  }

  // Server-side context
  const token = getAuthToken(req);

  if (!token) {
    return false;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    if (res) {
      clearAuthCookie(res);
    }
    return false;
  }

  if (next) {
    req.user = decoded;
    next();
  }

  return decoded;
}

// export function requireRole(roles) {
//   return async (req, res, next) => {
//     const user = await requireAuth(req, res);
    
//     if (!user) {
//       return;
//     }

//     if (!roles.includes(user.role)) {
//       if (res) {
//         res.status(403).json({ message: 'Insufficient permissions' });
//       }
//       return;
//     }

//     if (next) {
//       next();
//     }
//   };
// }

export function requireRole(roles) {
  return async (req, res) => {
    const user = await requireAuth(req, res);

    if (!user) {
      // If user is not authenticated, redirect to login or show error
      return {
        redirect: {
          destination: '/login',
          permanent: false, // Set to false if you want a temporary redirect
        },
      };
    }

    if (!roles.includes(user.role)) {
      // If user does not have the correct role, show error page or redirect
      return {
        redirect: {
          destination: '/', // Example: Redirect to a 403 error page
          permanent: false,
        },
      };
    }

    // Continue if user has the correct role
    return;
  };
}

export async function logout() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Don't redirect here, let the component handle it
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

/**
 * Helper function to secure admin routes in getServerSideProps and API routes
 * @param {Object} context - The Next.js context object or { req, res } for API routes
 * @param {string} redirectPath - Optional custom redirect path, defaults to '/auth/login'
 * @param {boolean} isApi - Whether this is an API route (returns status codes instead of redirects)
 * @returns {Object|null} - Returns the user object if authenticated as admin, or a redirect object
 */
export async function requireAdmin(context, redirectPath = '/auth/login', isApi = false) {
  // Extract req and res from context
  const { req, res } = context;
  
  // Use requireAuth to authenticate
  const user = await requireAuth(req, res);
  
  // Not authenticated - redirect to login
  if (!user) {
    if (isApi) {
      res.status(401).json({ message: 'Authentication required' });
      return null;
    } else {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }
  }
  
  // Authenticated but not admin - redirect to appropriate page
  if (user.role !== 'admin') {
    if (isApi) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return null;
    } else {
      return {
        redirect: {
          destination: redirectPath || '/client',
          permanent: false,
        },
      };
    }
  }
  
  // Admin user - return the user object
  return user;
}

/**
 * Higher-order function to wrap API handlers with admin authentication
 * @param {Function} handler - The API route handler function
 * @returns {Function} - The wrapped handler function with admin authentication
 */
export function withAdminAuth(handler) {
  return async (req, res) => {
    // Pass isApi=true to indicate this is an API route
    const admin = await requireAdmin({ req, res }, null, true);
    
    // If not admin, requireAdmin already sent the appropriate response
    if (!admin) {
      return;
    }
    
    // Call the original handler with admin user attached to req
    req.user = admin;
    return handler(req, res);
  };
}

/**
 * Handle login redirect based on user role
 * @param {Object} user - The authenticated user object
 * @returns {Object} - Redirect object with appropriate destination
 */
export function getRedirectForRole(user) {
  if (!user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  
  // Redirect based on role
  if (user.role === 'admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/client',
        permanent: false,
      },
    };
  }
}

/**
 * Higher-order function to wrap API handlers with general authentication
 * @param {Function} handler - The API route handler function
 * @param {Array} allowedRoles - Optional array of allowed roles (if not specified, any authenticated user is allowed)
 * @returns {Function} - The wrapped handler function with authentication
 */
export function withAuth(handler, allowedRoles = null) {
  return async (req, res) => {
    const user = await requireAuth(req, res);
    
    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    // Check roles if specified
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    
    // Call the original handler with user attached to req
    req.user = user;
    return handler(req, res);
  };
}

/**
 * Get the appropriate redirect path based on user role
 * @param {Object} user - The user object with role information 
 * @returns {string} - The path to redirect to
 */
export function getRedirectPath(user) {
  if (!user) return '/auth/login';
  
  // First check role to determine where to redirect
  switch (user.role) {
    case 'admin':
      return '/admin'; 
    case 'client':
    default:
      return '/client';
  }
} 