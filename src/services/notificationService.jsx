import toast from 'react-hot-toast';

export const showToast = (message, type = 'success') => {
  const themes = {
    success: { border: '1px solid rgba(16, 185, 129, 0.5)', icon: '✅' },
    error: { border: '1px solid rgba(244, 63, 94, 0.5)', icon: '⚠️' },
    loading: { border: '1px solid rgba(59, 130, 246, 0.5)', icon: '🔄' }
  };

  toast[type === 'loading' ? 'loading' : type](message, {
    duration: 2500,
    style: {
      borderRadius: '16px',
      background: '#020617', // slate-950 for deeper contrast
      color: '#fff',
      border: themes[type]?.border || themes.success.border,
      fontSize: '12px',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      padding: '12px 20px',
    },
    position: 'top-center',
  });
};