import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, CheckCircle, User, Chrome, LogOut, X, KeyRound, Smartphone } from 'lucide-react';
import { AppUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onLogin: (user: Partial<AppUser>) => void;
  onLogout: () => void;
}

export default function AuthModal({ isOpen, onClose, currentUser, onLogin, onLogout }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [sentOtp, setSentOtp] = useState('123456'); // Simulation OTP code
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleGoogleLogin = () => {
    onLogin({
      name: 'Dheeraj Kumar',
      email: 'dheerajexperiment29@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: true
    });
    showMsg('Successfully synced with Google Account!');
    setTimeout(onClose, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email || !password) {
        showMsg('Please fill in both email and password fields.', 'error');
        return;
      }
      // OTP Simulation trigger
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedOtp);
      setMode('otp');
      showMsg(`A security OTP code has been simulated for testing: ${generatedOtp}`, 'success');
    } else if (mode === 'signup') {
      if (!email || !password || !name) {
        showMsg('Please complete all fields.', 'error');
        return;
      }
      onLogin({
        name,
        email,
        isLoggedIn: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
      });
      showMsg('Registration completed! Enjoy local cloud backup sync.');
      setTimeout(onClose, 1200);
    } else if (mode === 'reset') {
      if (!email) {
        showMsg('Please enter your email.', 'error');
        return;
      }
      showMsg('A reset link has been dispatched to your email (simulated).');
      setMode('login');
    } else if (mode === 'otp') {
      if (otpInput === sentOtp || otpInput === '123456') {
        onLogin({
          name: email.split('@')[0],
          email,
          isLoggedIn: true,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
        });
        showMsg('Security verified. Login successful.');
        setTimeout(onClose, 1200);
      } else {
        showMsg('Invalid verification code. Use: ' + sentOtp, 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-500" />
            {currentUser.isLoggedIn ? 'Your Sync Profile' : 
             mode === 'login' ? 'Sign In' : 
             mode === 'signup' ? 'Create Account' : 
             mode === 'reset' ? 'Reset Password' : 'Verifying Security OTP'}
          </h3>
          <button onClick={onClose} aria-label="Close authentication window" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {message && (
            <div className={`p-3 rounded-lg mb-4 text-xs font-mono flex items-start gap-2 ${
              message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
              : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 shrink-0 mt-0.5" /> : <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />}
              <div>{message.text}</div>
            </div>
          )}

          {currentUser.isLoggedIn ? (
            <div className="text-center py-4">
              <div className="relative inline-block mb-3">
                <img 
                  src={currentUser.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                  alt="User Avatar" 
                  className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover mx-auto mx-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white dark:ring-zinc-900">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-xl">{currentUser.name}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-mono mt-1">{currentUser.email}</p>
              
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mt-6 text-left border border-zinc-100 dark:border-zinc-800/80">
                <h5 className="font-semibold text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Cloud Sync Status</h5>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 dark:text-zinc-400">Notes & Settings saved</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Synced Live</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  onLogout();
                  showMsg('Logged out successfully.');
                }}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Google OAuth Login Simulation */}
              {mode !== 'otp' && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full ring-1 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Chrome className="w-4 h-4 text-rose-500" />
                    Continue with Google
                  </button>
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                    <span className="px-3 text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest bg-white dark:bg-zinc-900">Or Email</span>
                    <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                  </div>
                </>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Your Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all dark:text-white"
                      placeholder="e.g. Dheeraj Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {mode !== 'otp' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all dark:text-white"
                      placeholder="e.g. dheeraj@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {mode !== 'reset' && mode !== 'otp' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('reset')}
                        className="text-xs text-indigo-500 hover:underline hover:text-indigo-600"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="password"
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all dark:text-white"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {mode === 'otp' && (
                <div>
                  <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mb-4 bg-yellow-50 dark:bg-zinc-800/80 p-3.5 rounded-xl border border-yellow-200 dark:border-zinc-700">
                    <Smartphone className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    For test security, we simulated sending a verification OTP to <strong className="font-mono text-indigo-500">{sentOtp}</strong>.<br />Please enter it below:
                  </div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full text-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl py-3 text-lg font-mono tracking-widest outline-none transition-all dark:text-white"
                    placeholder="000 000"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm mt-2 flex items-center justify-center gap-1 cursor-pointer"
              >
                {mode === 'login' ? 'Proceed with Login' : 
                 mode === 'signup' ? 'Create Free Account' : 
                 mode === 'reset' ? 'Send Reset Link' : 'Confirm & Authenticate'}
              </button>

              <div className="text-center text-xs mt-4">
                {mode === 'login' ? (
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setMode('signup')} className="text-indigo-500 hover:underline font-semibold">
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-indigo-500 hover:underline font-semibold">
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
