'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/actions/auth';

interface HeaderProps {
  session: {
    username: string;
    role: 'user' | 'admin';
  } | null;
}

export default function Header({ session }: HeaderProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:opacity-90 transition">
            📋 Survey App
          </Link>
          
          <nav className="flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/"
                  className={`hover:opacity-90 transition ${
                    pathname === '/' ? 'font-semibold underline' : ''
                  }`}
                >
                  Surveys
                </Link>
                {session.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`hover:opacity-90 transition ${
                      pathname === '/admin' ? 'font-semibold underline' : ''
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {session.username} ({session.role})
                  </span>
                  <form action={handleLogout}>
                    <button
                      type="submit"
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="hover:opacity-90 transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}