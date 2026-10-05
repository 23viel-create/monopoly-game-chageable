import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { saveSession } from '../auth';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import Alert from '../components/Alert';
import SubmitButton from '../components/SubmitButton';

function LoginPage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/users/login', formData);
      saveSession(data.token, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-emerald-700 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      {!error && <Alert type="success">{location.state?.message}</Alert>}
      <Alert type="error">{error}</Alert>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <FormInput
          label="Password"
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <SubmitButton loading={loading} loadingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default LoginPage;
