import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Users, 
  ShoppingBag, 
  FileText, 
  Settings, 
  CreditCard,
  BookOpen,
  HelpCircle,
  FileKey,
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Products",
    icon: <ShoppingBag className="h-5 w-5" />,
    href: "/admin/products"
  },
  {
    title: "Orders",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/admin/orders"
  },
  {
    title: "Users",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users"
  },
  {
    title: "License Keys",
    icon: <FileKey className="h-5 w-5" />,
    href: "/admin/licenses"
  },
  {
    title: "Installation Guides",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/admin/installation-guides"
  },
  {
    title: "Support",
    icon: <HelpCircle className="h-5 w-5" />,
    href: "/admin/support"
  },
  {
    title: "Content",
    icon: <FileText className="h-5 w-5" />,
    href: "/admin/content"
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin/settings"
  }
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <Link href="/admin" className="text-2xl font-bold text-gray-800">
            Admin Panel
          </Link>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const isActive = router.pathname.startsWith(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`
                  flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100
                  ${isActive ? 'bg-blue-50 text-blue-600' : ''}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="py-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
