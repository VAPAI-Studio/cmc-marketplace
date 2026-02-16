import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { Film } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement Supabase auth
      console.log('Login:', { email, password });

      // Mock success for now
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cmc-navy hover:opacity-80 transition">
            <Film className="w-10 h-10 text-cmc-gold" />
            <span className="text-3xl font-bold">CMC</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-cmc-navy">Welcome back</h1>
          <p className="mt-2 text-warm-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-warm-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-cmc-navy hover:text-cmc-gold transition">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-warm-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-cmc-navy hover:text-cmc-gold transition font-medium">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
