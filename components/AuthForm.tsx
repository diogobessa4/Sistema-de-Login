
import React, { useState, useEffect } from 'react';
import { AuthMode } from '../types';
import { analyzePasswordStrength } from '../services/geminiService';

interface AuthFormProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  onSubmit: (...args: any[]) => Promise<void>;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, setMode, onSubmit, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState<{score: number, feedback: string} | null>(null);

  // Simple debounced AI analysis for password
  useEffect(() => {
    if (password.length < 6) {
      setStrength(null);
      return;
    }
    const timer = setTimeout(async () => {
      const result = await analyzePasswordStrength(password);
      setStrength(result);
    }, 1000);
    return () => clearTimeout(timer);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === AuthMode.REGISTER) {
      await onSubmit(name, email, password);
    } else {
      await onSubmit(email, password);
    }
    setLoading(false);
  };

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {mode === AuthMode.LOGIN ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-400 text-sm">
          {mode === AuthMode.LOGIN 
            ? 'Access your secure dashboard' 
            : 'Join our secure community today'}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl mb-6 animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === AuthMode.REGISTER && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
            <input 
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-white transition-all focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
          <input 
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-white transition-all focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            {mode === AuthMode.LOGIN && (
              <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot?
              </button>
            )}
          </div>
          <div className="relative group/password">
            <input 
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none rounded-xl px-4 py-3 pr-12 text-white transition-all focus:ring-4 focus:ring-blue-500/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {mode === AuthMode.REGISTER && password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div 
                    key={s} 
                    className={`h-full flex-grow transition-all duration-500 ${strength && strength.score >= s ? getStrengthColor(strength.score) : 'bg-transparent'}`}
                  />
                ))}
              </div>
              {strength && (
                <p className="text-[10px] text-slate-500 italic">AI: {strength.feedback}</p>
              )}
            </div>
          )}
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            mode === AuthMode.LOGIN ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-slate-500">
          {mode === AuthMode.LOGIN ? "Don't have an account?" : "Already have an account?"}
        </span>
        <button 
          onClick={() => {
            setMode(mode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
            setShowPassword(false);
          }}
          className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
        >
          {mode === AuthMode.LOGIN ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
