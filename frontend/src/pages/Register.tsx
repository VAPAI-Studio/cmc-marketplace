import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Select, Card } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useToastHelpers } from '../components/ui';
import { Film } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const toast = useToastHelpers();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: 'creator', label: 'Creator (I have content to sell)' },
    { value: 'buyer', label: 'Buyer (I want to find content)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    if (!formData.displayName.trim()) {
      toast.error('Please enter your display name');
      return;
    }

    setLoading(true);

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.role as 'creator' | 'buyer',
        formData.displayName
      );
      navigate('/dashboard');
    } catch (err) {
      // Error handled by auth context (shows toast)
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <h1 className="mt-6 text-3xl font-bold text-cmc-navy">Create your account</h1>
          <p className="mt-2 text-warm-gray-600">Join the global IP marketplace</p>
        </div>

        {/* Register Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">

            <Select
              label="I am a..."
              options={roleOptions}
              placeholder="Select your role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              required
            />

            <Input
              type="text"
              label="Display Name"
              placeholder="John Doe"
              value={formData.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
            />

            <div className="text-xs text-warm-gray-600">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-cmc-navy hover:text-cmc-gold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-cmc-navy hover:text-cmc-gold">
                Privacy Policy
              </Link>
              .
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-warm-gray-600">Already have an account? </span>
            <Link to="/login" className="text-cmc-navy hover:text-cmc-gold transition font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
