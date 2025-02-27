import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/edit-profile" className="text-xl font-bold">
          User Management
        </Link>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user.name}</span>
          <button
            onClick={() => logout()}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}