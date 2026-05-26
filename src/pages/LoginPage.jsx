import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      login(response.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed blur-[120px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-primary-container text-[32px]">corporate_fare</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">HR Connect</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Leave Management System</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm text-center mb-4 border border-error/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-12 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary-container text-on-primary-container font-semibold text-body-md rounded-lg hover:bg-primary-container/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && (
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              )}
            </button>
          </form>
        </div>
      </main>

      {isLoading && (
        <div className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-primary font-semibold">Authenticating...</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
