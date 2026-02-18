import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Film, Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="container-custom py-24 flex flex-col items-center text-center">
      <div className="bg-cmc-navy-50 rounded-full p-6 mb-8">
        <Film className="w-16 h-16 text-cmc-navy opacity-40" />
      </div>
      <h1 className="text-6xl font-bold text-cmc-navy mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-warm-gray-700 mb-3">Page not found</h2>
      <p className="text-warm-gray-500 max-w-md mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button variant="primary" size="lg" icon={<Home className="w-5 h-5" />}>
            Go Home
          </Button>
        </Link>
        <Link to="/library">
          <Button variant="secondary" size="lg" icon={<Search className="w-5 h-5" />}>
            Browse Library
          </Button>
        </Link>
      </div>
    </div>
  );
}
