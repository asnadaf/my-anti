import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon, ShoppingCart, User, LogOut } from 'lucide-react';
import { logout } from '@lib/auth';

export default function Layout({ children }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Skip auth check for root path to prevent interference with redirection
    if (router.pathname === '/') {
      setIsLoading(false);
      return;
    }
    
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include',
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router.pathname]); // Re-check auth when route changes

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await logout();
      setIsAuthenticated(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-background border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/buyantivirus" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Your Logo</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/buyantivirus/products" className="nav-link">
                  Products
                </Link>
                <Link href="/buyantivirus/about" className="nav-link">
                  About
                </Link>
                <Link href="/buyantivirus/contact" className="nav-link">
                  Contact
                </Link>
                <Link href="/buyantivirus/support" className="nav-link">
                  Support
                </Link>
                <Link href="/buyantivirus/faq" className="nav-link">
                  FAQ
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-accent"
              >
                {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link href="/cart" className="p-2 rounded-lg hover:bg-accent">
                <ShoppingCart size={20} />
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-accent"
                  title="Logout"
                  disabled={isLoading}
                >
                  <LogOut size={20} />
                </button>
              ) : (
                <Link href="/auth/login" className="p-2 rounded-lg hover:bg-accent">
                  <User size={20} />
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link href="/buyantivirus" className="text-muted-foreground hover:text-foreground">All Products</Link></li>
                <li><Link href="/buyantivirus/support" className="text-muted-foreground hover:text-foreground">Support</Link></li>
                <li><Link href="/buyantivirus/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/buyantivirus/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link href="/buyantivirus/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">Twitter</Link></li>
                <li><Link href="https://facebook.com" className="text-muted-foreground hover:text-foreground">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 