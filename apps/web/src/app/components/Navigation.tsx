'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardOutlined } from '@ant-design/icons';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/health-metrics', label: 'Health Metrics', icon: '❤️' },
    { href: '/needs-attention', label: 'Needs Attention', icon: '⚠️' },
    { href: '/customer-journey', label: 'Customer Journey', icon: '👤' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <DashboardOutlined className="text-2xl text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Ops Dashboard</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 
