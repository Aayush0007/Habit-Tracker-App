import React, { useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  const onCaptchaChange = (token) => setCaptchaToken(token);

  const getSecurityLevel = (pass) => {
    if (pass.length === 0) return { label: 'AWAITING KEY', color: 'text-slate-600' };
    if (pass.length > 10) return { label: 'ENCRYPTED', color: 'text-emerald-500' };
    if (pass.length > 6) return { label: 'SECURE', color: 'text-blue-500' };
    return { label: 'VULNERABLE', color: 'text-rose-500' };
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!captchaToken) return alert("Security Protocol: Complete reCAPTCHA to verify identity.");

    setLoading(true);
    try {
      let result;
      if (isRegistering) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            captchaToken,
            emailRedirectTo: window.location.origin,
          },
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
          options: { captchaToken },
        });
      }

      if (result.error) {
        alert(result.error.message);
        if (captchaRef.current) captchaRef.current.reset();
        setCaptchaToken(null);
      } else if (isRegistering && !result.data.session) {
        alert("Warrior Registered! Verification link sent to email. Activation required for deployment.");
      }
    } catch (err) {
      alert("System Error: Critical failure during uplink.");
    } finally {
      setLoading(false);
    }
  };

  const security = getSecurityLevel(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl z-10 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/10 rounded-3xl mb-6 border-2 border-blue-500/20 shadow-inner">
            <ShieldCheck className="text-blue-500" size={40} />
          </div>
          <h1 className="text-5xl font-black italic text-white tracking-tighter uppercase leading-none">
            Warrior <span className="text-blue-500">Mode</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-4 opacity-70">
            Command Center Initialization
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text" required placeholder="Officer Name"
                  className="w-full bg-slate-950/50 border-2 border-slate-800 p-4 pl-12 rounded-2xl focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-700"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Uplink Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email" required placeholder="unit@hq.mil"
                className="w-full bg-slate-950/50 border-2 border-slate-800 p-4 pl-12 rounded-2xl focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-700"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
              <span className={`text-[8px] font-black uppercase tracking-tighter ${security.color}`}>{security.label}</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? "text" : "password"} required placeholder="••••••••"
                className="w-full bg-slate-950/50 border-2 border-slate-800 p-4 pl-12 pr-12 rounded-2xl focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-700"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-center py-3 bg-slate-950/30 rounded-2xl border-2 border-slate-800/50">
             <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={onCaptchaChange}
              ref={captchaRef}
              theme="dark"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="group relative w-full overflow-hidden bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50 active:scale-95"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} className="fill-current" /> {isRegistering ? 'Register Warrior' : 'Initialize Command'}</>}
            </div>
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); if (captchaRef.current) captchaRef.current.reset(); setCaptchaToken(null); }}
            className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest underline underline-offset-8"
          >
            {isRegistering ? 'Return to HQ Login' : 'Register New Deployment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;