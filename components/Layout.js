import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Sun, Moon, ShoppingCart, User, LogOut } from 'lucide-react';
import { logout } from '@lib/auth';
import Footer from '../components/Footer';

export default function Layout({ children, title = 'Buy Antivirus Software | Secure Your Devices', description = 'Protect your devices with our premium antivirus software. Get real-time protection against viruses, malware, and online threats.' }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Check authentication status only once on mount
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
  }, []); // Empty dependency array means this runs only once on mount

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Buy Antivirus Software",
    "url": "https://yourdomain.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://yourdomain.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yourdomain.com${router.asPath}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={`https://yourdomain.com${router.asPath}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="bg-background border-b" role="banner">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/buyantivirus" className="flex-shrink-0 flex items-center" aria-label="Home">
                  <span className="text-xl font-bold">Your Logo</span>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/buyantivirus/products" className="nav-link" aria-label="View our products">
                    Products
                  </Link>
                  <Link href="/buyantivirus/about" className="nav-link" aria-label="Learn about us">
                    About
                  </Link>
                  <Link href="/buyantivirus/contact" className="nav-link" aria-label="Contact us">
                    Contact
                  </Link>
                  <Link href="/buyantivirus/support" className="nav-link" aria-label="Get support">
                    Support
                  </Link>
                  <Link href="/buyantivirus/faq" className="nav-link" aria-label="Frequently asked questions">
                    FAQ
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-accent"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <Link href="/cart" className="p-2 rounded-lg hover:bg-accent" aria-label="View shopping cart">
                  <ShoppingCart size={20} />
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-accent"
                    title="Logout"
                    disabled={isLoading}
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                ) : (
                  <Link href="/auth/login" className="p-2 rounded-lg hover:bg-accent" aria-label="Login or register">
                    <User size={20} />
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow" role="main">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
} 