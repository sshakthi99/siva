
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  Loader2, 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Globe, 
  Fingerprint, 
  Scan, 
  Target,
  UserCheck,
  UserPlus,
  User
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  registeredAt: string;
}

interface AuthGatewayProps {
  onVerified: (user: UserProfile) => void;
}

const AuthGateway: React.FC<AuthGatewayProps> = ({ onVerified }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'email' | 'biometric'>('biometric');
  const [step, setStep] = useState<'input' | 'processing' | 'otp'>('input');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [bioProgress, setBioProgress] = useState(0);
  const scanIntervalRef = useRef<number | null>(null);

  // Load existing users from localStorage
  const getUsers = (): UserProfile[] => {
    const saved = localStorage.getItem('bogi_users');
    return saved ? JSON.parse(saved) : [];
  };

  const saveUser = (user: UserProfile) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('bogi_users', JSON.stringify(users));
  };

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Enter a valid operational email address.');
      return;
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (authMode === 'register') {
      if (!name.trim()) {
        setError('Full legal name is required for registration.');
        return;
      }
      if (existingUser) {
        setError('This email is already registered in the BOGI database.');
        return;
      }
      
      setLoading(true);
      setTimeout(() => {
        const newUser: UserProfile = { name, email, registeredAt: new Date().toISOString() };
        saveUser(newUser);
        setLoading(false);
        setStep('otp');
        setTimer(59);
      }, 1500);
    } else {
      // Login Mode
      if (!existingUser) {
        setError('User record not found. Please register first.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
        setTimer(59);
      }, 1200);
    }
  };

  const handleStartBioScan = () => {
    setLoading(true);
    setStep('processing');
    setError(null);
    setBioProgress(0);

    let progress = 0;
    scanIntervalRef.current = window.setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        
        setTimeout(() => {
          const users = getUsers();
          // For biometric in this mock, we'll auto-login the first user or a dummy if empty
          const user = users[0] || { name: 'Biometric Asset', email: 'bio-auth@bogi.intel', registeredAt: new Date().toISOString() };
          onVerified(user);
        }, 800);
      }
      setBioProgress(progress);
    }, 200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Complete the 6-digit authorization code.');
      return;
    }
    
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (fullOtp === '123456' || fullOtp.length === 6) {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || { name: 'Verified Agent', email, registeredAt: new Date().toISOString() };
        onVerified(user);
      } else {
        setLoading(false);
        setError('Authorization code invalid or expired.');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* High-tech Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/5 blur-[180px] rounded-full -z-10" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.3)] mb-6">
            <Shield className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-widest mb-2 uppercase">BOGI</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Security Gateway Protocol</p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="flex justify-center gap-6 mb-8">
          <button 
            onClick={() => { setAuthMode('login'); setStep('input'); setError(null); }}
            className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${authMode === 'login' ? 'text-blue-500' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <User className="w-4 h-4" /> Login
          </button>
          <div className="w-px h-4 bg-slate-800" />
          <button 
            onClick={() => { setAuthMode('register'); setStep('input'); setError(null); }}
            className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${authMode === 'register' ? 'text-blue-500' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <UserPlus className="w-4 h-4" /> Register
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-1 shadow-2xl backdrop-blur-2xl">
          {/* Tabs for Method */}
          <div className="flex p-2 gap-2">
            <button 
              onClick={() => { setMethod('biometric'); setStep('input'); setLoading(false); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'biometric' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Fingerprint className="w-3.5 h-3.5" /> Biometric
            </button>
            <button 
              onClick={() => { setMethod('email'); setStep('input'); setLoading(false); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Mail className="w-3.5 h-3.5" /> Email OTP
            </button>
          </div>

          <div className="p-8">
            {method === 'biometric' ? (
              <div className="space-y-8 text-center">
                {step === 'input' ? (
                  <>
                    <div className="space-y-4">
                      <div className="relative mx-auto w-32 h-32 flex items-center justify-center border-2 border-slate-800 rounded-full overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
                        <Fingerprint className="w-16 h-16 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_infinite]" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-white font-black text-lg">Biometric Access</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Retina / Fingerprint Sync</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartBioScan}
                      className="w-full bg-slate-950 border border-slate-800 hover:border-blue-500/50 py-4 rounded-2xl text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group"
                    >
                      <Scan className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" /> 
                      Initialize Scanner
                    </button>
                  </>
                ) : (
                  <div className="space-y-8 py-4">
                    <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent" 
                          strokeDasharray={440} 
                          strokeDashoffset={440 - (440 * bioProgress) / 100}
                          className="text-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Target className="w-10 h-10 text-blue-500 animate-pulse mx-auto mb-1" />
                          <span className="text-xl font-black text-white mono">{Math.floor(bioProgress)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
                         {bioProgress < 30 ? 'Detecting Signature...' : bioProgress < 70 ? 'Verifying Bio-data...' : 'Finalizing Auth...'}
                       </p>
                       <p className="text-slate-500 text-[9px] uppercase font-bold mono">Protocol: AES-256 Signature Match</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {step !== 'otp' ? (
                  <form onSubmit={handleAuthSubmit} className="space-y-6">
                    {authMode === 'register' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <User className="w-3 h-3 text-blue-500" /> Full Name
                        </label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-500" /> Operational Email
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="agent@bogi.intel"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        <AlertCircle className="w-4 h-4" /> {error}
                      </div>
                    )}
                    <button 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'register' ? 'REGISTER NEW ASSET' : 'REQUEST AUTH CODE')}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-8 text-center">
                    <div className="space-y-2">
                      <div className="bg-blue-500/10 p-2 rounded-full border border-blue-500/20 w-fit mx-auto mb-2">
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                      </div>
                      <h2 className="text-white font-black text-lg">Verification</h2>
                      <p className="text-slate-500 text-xs font-medium">OTP sent to <span className="text-blue-400">{email}</span></p>
                    </div>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="w-12 h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-black text-blue-500 focus:outline-none focus:border-blue-500 transition-all"
                        />
                      ))}
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle className="w-4 h-4" /> {error}
                      </div>
                    )}
                    <div className="space-y-4">
                      <button 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'AUTHORIZE SESSION'}
                      </button>
                      <button 
                        type="button"
                        disabled={timer > 0}
                        onClick={() => { setStep('input'); setOtp(['', '', '', '', '', '']); }}
                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400 transition-colors disabled:opacity-30"
                      >
                        {timer > 0 ? `Retry in ${timer}s` : 'Resend Code'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-center items-center gap-8 opacity-20">
           <Globe className="w-5 h-5 text-slate-500" />
           <Lock className="w-5 h-5 text-slate-500" />
           <UserCheck className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AuthGateway;
