// src\components\Notification\Notification.jsx
import { Toaster } from 'react-hot-toast';

const NotificationProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: 'bg-slate-900 text-white border-2 border-slate-800 rounded-2xl font-bold text-sm uppercase tracking-tight shadow-2xl',
        duration: 3000,
        success: {
          iconTheme: { primary: '#10b981', secondary: '#000' },
          style: { border: '2px solid rgba(16, 185, 129, 0.2)' }
        },
        error: {
          iconTheme: { primary: '#f43f5e', secondary: '#000' },
          style: { border: '2px solid rgba(244, 63, 94, 0.2)' }
        },
      }}
    />
  );
};

export default NotificationProvider;