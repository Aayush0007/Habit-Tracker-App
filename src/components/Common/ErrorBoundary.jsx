import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log this to Supabase or a service like Sentry later
    console.error("System Crash Captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-6 bg-slate-950 border-2 border-dashed border-rose-500/20 rounded-[2rem] m-6">
          <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20 animate-pulse">
            <AlertTriangle className="text-rose-500" size={48} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">System Malfunction</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
              A non-critical error has been detected in the deployment module.
            </p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl active:scale-95"
          >
            <RefreshCw size={16} />
            Re-Initialize Suite
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;