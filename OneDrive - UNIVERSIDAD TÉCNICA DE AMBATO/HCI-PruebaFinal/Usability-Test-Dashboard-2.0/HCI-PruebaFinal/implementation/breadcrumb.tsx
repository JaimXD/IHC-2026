/**
 * BREADCRUMB - Navegación Contextual
 * Resuelve: Problema 8 (Sin breadcrumbs)
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathname.split('/').filter(Boolean).map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: index === arr.length - 1 ? undefined : '/' + arr.slice(0, index + 1).join('/')
    }))
  ];

  return (
    <nav className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-400">›</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="text-blue-600 hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </ol>
    </nav>
  );
}
